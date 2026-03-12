import { IsValidText } from '@/common/custom-validation';

export class RefreshDto {
  @IsValidText({
    minLength: 1,
    required: true,
    message: 'Refresh token is required',
  })
  refreshToken: string;
}
