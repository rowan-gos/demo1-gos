import { IsEmail } from 'class-validator';
import { IsStrongPassword } from '../../../common/validators';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
