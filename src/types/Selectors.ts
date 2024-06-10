export type ProductType = 'personal' | 'vendor'

export type DetailPageSelectors = {
  [T in ProductType]: DetailPageSelector;
}

export type DetailPageSelector = {
  TITLE: string;
  SUBTITLE: string;
  PRICE: string;
  IMAGES: string;

  /** 옵션 모달 토글을 위한 버튼 */
  OPTION_TOGGLE: string;

  /** 옵션 모달에 포함된 옵션 리스트 */
  OPTION_LIST: string;
}
