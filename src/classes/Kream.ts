import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';
import parsePrice from '../utils/parsePrice';
import { LoginValidationError, LoginFailedError, ProductNotFoundError } from '../errors';
import { detailPageSelectors } from '../constants/selectors';
import { ProductType } from '../types/Selectors';
import { IKream } from '../interfaces/IKream';

export class Kream implements IKream {
  private browser: Browser

  private constructor(browser: Browser) {
    this.browser = browser;
  }

  static async login(email: string, password: string) {
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
    } catch (err)  {
      await browser.close();
      throw err
    }
  }

  async getProductBaseInfo(productId: string, useBasePage: boolean = true) {
    const url = `https://kream.co.kr/products/${productId}`
    const basePage = await this.browser.newPage();

    let content: string = '';

    // TODO: 상품 타입 구분 로직 추가
    const productType: ProductType = 'personal';

    try {
      await basePage.goto(url)
      content = await basePage.content()

      if(content.includes('찾을 수 없는 페이지입니다.')) {
        throw new ProductNotFoundError()
      }

      const hasOptions = await basePage.$(detailPageSelectors[productType].OPTION_TOGGLE) !== null;

      if(hasOptions) {
        await basePage.click(detailPageSelectors[productType].OPTION_TOGGLE)
        content = await basePage.content();
      }

      const $ = cheerio.load(content);

      const title = $(detailPageSelectors[productType].TITLE).text();
      const subtitle = $(detailPageSelectors[productType].SUBTITLE).text();
      const price = parsePrice($(detailPageSelectors[productType].PRICE).text());
      const images = $(detailPageSelectors[productType].IMAGES)
        .map((_, element) => $(element).attr('src'))
        .get()
        .filter(src => src !== undefined) as string[];
      const options = hasOptions ? $(detailPageSelectors[productType].OPTION_LIST)
        .map((_, element) => $(element).text())
        .get() as string[] : null;

      return {
        baseInfo: {
          title, 
          subtitle, 
          price, 
          images, 
          options
        }, 
        ...(useBasePage && { basePage })
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

  // TODO: 구현
  async getProductDetailInfo(basePage: Page, option: string | null) {
    return {} as any ;
  }

  // TODO: 구현
  async getProductInfo(productId: string) {
    const { baseInfo } = await this.getProductBaseInfo(productId)
    return {
      ...baseInfo, 
      details: {}
    }
  }

  async close() {
    await this.browser.close();
  }
}
