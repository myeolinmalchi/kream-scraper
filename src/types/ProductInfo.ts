/** 상품 기본 정보 */
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

/** 상품 옵션별 상세 정보 */
export type ProductDetailInfo = {
  /** 즉시 거래가 */
  price: number | null

  /** 체결 거래 */
  trades: Trade[] | null

  /** 판매 입찰 */
  sellBids: Bid[] | null
  
  /** 구매 입찰 */
  buyBids: Bid[] | null
}

/** 상품 전체 정보 */
export type ProductInfo = ProductBaseInfo & {
  details: {
    [option: string]: ProductDetailInfo
  }
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
