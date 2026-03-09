import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export function IsVietnamesePhone() {
  return applyDecorators(
    IsString(),
    Matches(/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, {
      message:
        'Số điện thoại phải là số điện thoại Việt Nam hợp lệ (ví dụ: 0912345678, +84912345678 hoặc 84912345678)',
    }),
    ApiProperty({
      description: 'Số điện thoại Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09)',
      example: '0912345678',
    }),
  );
}
