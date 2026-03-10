import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() input: { email: string; password: string }) {
    return this.authService.authenticate(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() input: RefreshDto) {
    return this.authService.refresh(input);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }
}
