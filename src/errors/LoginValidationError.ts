export class LoginValidationError extends Error {
  constructor(message: string = '올바른 이메일/비밀번호를 입력해 주세요.') {
    super(message);
    this.name = 'LoginValidationError'
  }
}
