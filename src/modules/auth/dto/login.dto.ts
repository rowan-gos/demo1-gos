import { IsValidEmail, IsValidText } from '@/common/custom-validation';

export class LoginDto {
  @IsValidEmail({
    required: true,
    message: 'Email is invalid',
  })
  email: string;

  @IsValidText({
    minLength: 8,
    maxLength: 255,
    required: true,
    message: 'Password is required',
  })
  password: string;
}
