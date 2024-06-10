import { Page } from "puppeteer";
import { ProductBaseInfo, ProductDetailInfo, ProductInfo } from "../types/ProductInfo";

export interface IKream {
  getProductBaseInfo(productId: string, useBasePage: boolean): Promise<{ baseInfo: ProductBaseInfo, basePage?: Page }>;
  getProductDetailInfo(basePage: Page, size: string): Promise<ProductDetailInfo>;
  getProductInfo(productId: string): Promise<ProductInfo>;
}
