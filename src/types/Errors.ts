export class LoginValidationError extends Error {
  constructor(message?: string) {
    super(message ?? '올바른 이메일/비밀번호를 입력해 주세요.');
    this.name = 'LoginValidationError'
  }
}

export class LoginFailedError extends Error {
  constructor(message?: string) {
    super(message ?? '로그인에 실패하였습니다.');
    this.name = 'LoginFailedError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? '존재하지 않는 상품입니다.');
    this.name = 'ProductNotFoundError';
  }
}
