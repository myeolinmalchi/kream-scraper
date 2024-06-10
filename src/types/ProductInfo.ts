export type ProductBaseInfo = {
  /** 상품명 */
  title: string | null

  /** 부제목 */
  subtitle: string | null

  /** 즉시 구매가 */
  price: number | null

  /** 상품 이미지 */
  images: string[] | null

  /** 상품 옵션 */
  options: string[] | null;
}

export type ProductDetailInfo = {
  /** 체결 거래 */
  trades: Trade[] | null

  /** 판매 입찰 */
  sellBids: Bid[] | null
  
  /** 구매 입찰 */
  buyBids: Bid[] | null
}

type Options = ProductBaseInfo['options'] extends (infer U)[] ? U : never;

export type ProductInfo = ProductBaseInfo & {
  [O in Options]: ProductDetailInfo;
}

type Trade = {
  seq: number
  date: Date
  price: number
}

type Bid = {
  seq: number
  price: number;
  quantity: number;
}
