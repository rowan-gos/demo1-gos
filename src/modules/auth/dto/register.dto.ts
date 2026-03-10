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
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  lastName: string;

  @IsVietnamesePhone()
  phone: string;
}
