import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';
import parsePrice from './utils/parsePrice';
import { ProductBaseInfo, ProductInfo, ProductInfos } from './types/ProductInfo';
import { LoginValidationError, LoginFailedError, ProductNotFoundError } from './types/Errors';

class Kream {
  private browser: Browser

  private constructor(browser: Browser) {
    this.browser = browser;
  }

  static async login(email: string, password: string): Promise<Kream> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
      await page.goto('https://kream.co.kr/login');

      await page.type('.login_area input[type="email"]', email)
      await page.type('.login_area input[type="password"]', password)

      const isDisabled = await page.$('.login_btn_box a[disabled="disabled"]') !== null;

      if(isDisabled) {
        throw new LoginValidationError();
      }

      await page.click('.login_btn_box a');

      if(page.url() !== 'https://kream.co.kr') {
        throw new LoginFailedError()
      }

      await page.close();

      return new Kream(browser)
    } catch (err) {
      await browser.close();
      throw err
    }
  }

  private async getProductBaseInfo(productId: string): Promise<ProductBaseInfo> {
    const url = `https://kream.co.kr/products/${productId}`
    const basePage = await this.browser.newPage();

    try {
      await basePage.goto(url)
      const content = await basePage.content()

      if(content.includes('찾을 수 없는 페이지입니다.')) {
        throw new ProductNotFoundError()
      }

      const $ = cheerio.load(content);

      await basePage.close();

      const title = $('#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.main-title-container > p.title').text();
      const subtitle = $('#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.main-title-container > p.sub-title').text();
      const priceStr = $('#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.price-container > div.price-text-container > p.text-lookup.price.display_paragraph').text();

      const price = parsePrice(priceStr);

      return {
        title, 
        subtitle, 
        price,
        images: [], 
        options: [],
      };
    } catch(err) {
      if(err instanceof ProductNotFoundError) {
        await basePage.close();
        throw err
      }

      await this.browser.close();
      throw err
    }
  }

  async close() {
    await this.browser.close();
  }
}
