import {
  IsValidEmail,
  IsValidText,
  IsValidPhoneNumber,
} from '@/common/custom-validation';
import { IsStrongPassword } from '@/common/validators';

export class RegisterDto {
  @IsValidEmail({
    required: true,
    message: 'Email is invalid or already in use',
  })
  email: string;

  @IsStrongPassword()
  password: string;

  @IsValidText({
    minLength: 2,
    maxLength: 100,
    required: true,
    trim: true,
    message: 'First name must be between 2 and 100 characters',
  })
  firstName: string;

  @IsValidText({
    minLength: 2,
    maxLength: 100,
    required: true,
    trim: true,
    message: 'Last name must be between 2 and 100 characters',
  })
  lastName: string;

  @IsValidPhoneNumber({
    required: true,
    trim: true,
    message: 'Phone number is invalid',
  })
  phone: string;
}
