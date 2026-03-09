import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  first_name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  last_name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;
}
