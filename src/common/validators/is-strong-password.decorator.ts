import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export function IsStrongPassword() {
  return applyDecorators(
    IsString(),
    MinLength(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    }),
    MaxLength(128, {
      message: 'Mật khẩu không được vượt quá 128 ký tự',
    }),
    Matches(/[A-Z]/, {
      message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa',
    }),
    Matches(/[a-z]/, {
      message: 'Mật khẩu phải chứa ít nhất một chữ cái viết thường',
    }),
    Matches(/\d/, {
      message: 'Mật khẩu phải chứa ít nhất một chữ số',
    }),
    Matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/, {
      message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt',
    }),
    ApiProperty({
      description:
        'Mật khẩu mạnh: 8-128 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt',
      example: 'MyPass123!',
      minLength: 8,
      maxLength: 128,
    }),
  );
}
