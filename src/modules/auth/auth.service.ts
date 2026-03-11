import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import bcryptHelper from '../../common/utils/bcrypt.helper';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'default-secret',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
      }),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
  async authenticate(input: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(input);

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateUser(input: LoginDto): Promise<User> {
    const user = await this.userService.findOne(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptHelper.comparePassword(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async refresh(input: RefreshDto): Promise<RefreshResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        input.refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        },
      );

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(input: RegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userService.findOne(input.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcryptHelper.generateWithBcrypt({
      source: input.password,
    });
    const newUser = await this.userService.create({
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);

    return {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }
}
