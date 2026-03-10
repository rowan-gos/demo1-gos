export class LoginResponseDto {
  access_token: string;
  refresh_token: string;

  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}
