import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

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
        throw new Error('올바른 이메일/비밀번호를 입력해 주세요.')
      }

      await page.click('.login_btn_box a');

      if(page.url() !== 'https://kream.co.kr') {
        throw new Error('로그인에 실패하였습니다.')
      }

      await page.close();

      return new Kream(browser)
    } catch (err) {
      await browser.close();
      console.error(err)
      throw err
    }
  }

  async close() {
    await this.browser.close();
  }
}
