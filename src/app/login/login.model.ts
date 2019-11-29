export class LoginResponse {
  codUser: Number;
  name: string;
  email: string;
  accessToken: string;
  tokenType: string;
  roles: Array<Object>;
}
