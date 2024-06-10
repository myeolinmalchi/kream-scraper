import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';
import parsePrice from '../utils/parsePrice';
import { ProductInfo, ProductBaseInfo, ProductDetailInfo } from '../types/ProductInfo';
import { LoginValidationError, LoginFailedError, ProductNotFoundError } from '../errors';
import { detailPageSelectors } from '../constants/selectors';
import { ProductType } from '../types/Selectors';
import { IKream } from '../interfaces/IKream';

export class Kream implements IKream {
  private browser: Browser

  private constructor(browser: Browser) {
    this.browser = browser;
  }

  static async login(email: string, password: string): Promise<IKream> {
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

  async getProductBaseInfo(productId: string, useBasePage: boolean = true): Promise<{ baseInfo: ProductBaseInfo, basePage?: Page }> {
    const url = `https://kream.co.kr/products/${productId}`
    const basePage = await this.browser.newPage();

    const productType: ProductType = 'personal';

    try {
      await basePage.goto(url)
      const content = await basePage.content()

      if(content.includes('찾을 수 없는 페이지입니다.')) {
        throw new ProductNotFoundError()
      }

      const $ = cheerio.load(content);

      const title = $(detailPageSelectors[productType].TITLE).text();
      const subtitle = $(detailPageSelectors[productType].SUBTITLE).text();
      const price = parsePrice($(detailPageSelectors[productType].PRICE).text());
      const images = $(detailPageSelectors[productType].IMAGES)
        .map((_, element) => $(element).attr('src'))
        .get()
        .filter(src => src !== undefined) as string[];

      const isSingleOption: boolean = $(detailPageSelectors[productType].OPTIONS).length === 0;

      if(isSingleOption) {
        if(!useBasePage) {
          await basePage.close();
        }

        return {
          baseInfo: {
            title, 
            subtitle, 
            price, 
            images, 
            options: null
          }, 
          ...(useBasePage && { basePage })
        }
      }

      return {
        baseInfo: {
          title, 
          subtitle, 
          price, 
          images, 
          options: []
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

  async getProductDetailInfo(basePage: Page, size: string): Promise<ProductDetailInfo> {
    return {} as ProductDetailInfo;
  }

  async getProductInfo(productId: string): Promise<ProductInfo> {
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
