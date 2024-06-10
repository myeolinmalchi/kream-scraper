export class LoginFailedError extends Error {
  constructor(message: string = '로그인에 실패하였습니다') {
    super(message);
    this.name = 'LoginFailedError';
  }
}
