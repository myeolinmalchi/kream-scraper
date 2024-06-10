import { DetailPageSelectors } from "../types/Selectors";

export const detailPageSelectors: DetailPageSelectors = {
  /** 개인거래 상품 */
  personal: {
    TITLE: '#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.main-title-container > p.title', 
    SUBTITLE: '#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.main-title-container > p.sub-title', 
    PRICE: '#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.price-container > div.price-text-container > p.text-lookup.price.display_paragraph',
    IMAGES: '#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div.column.is_fixed > div.column_box > div.detail_banner_area.lg > div > div > div.flicking-camera > div img[alt="상품 이미지"]',
    OPTIONS: '#wrap > div.layout__main--without-search.container.detail.lg > div.content > div.column_bind > div:nth-child(2) > div > div.column_top > div.product_figure_wrap.lg > div',
  }, 

  /** 업체 판매 상품 */
  vendor: {
    TITLE: '', 
    SUBTITLE: '', 
    PRICE: '',
    IMAGES: '',
    OPTIONS: '',
  }
} as const
