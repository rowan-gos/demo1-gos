import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import {
  IsStrongPassword,
  IsVietnamesePhone,
} from '../../../common/validators';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  first_name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  last_name: string;

  @IsVietnamesePhone()
  phone: string;
}
