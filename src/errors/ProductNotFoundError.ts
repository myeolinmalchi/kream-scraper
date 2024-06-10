export class ProductNotFoundError extends Error {
  constructor(message: string = '존재하지 않는 상품입니다.') {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}
