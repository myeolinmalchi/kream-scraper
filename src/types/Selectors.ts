export type ProductType = 'personal' | 'vendor'

export type DetailPageSelectors = {
  [T in ProductType]: DetailPageSelector;
}

export type DetailPageSelector = {
  TITLE: string;
  SUBTITLE: string;
  PRICE: string;
  IMAGES: string;
  OPTIONS: string;
}
