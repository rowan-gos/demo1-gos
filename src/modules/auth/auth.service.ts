import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcryptHelper from '../../common/utils/bcrypt.helper';

type AuthInput = {
  email: string;
  password: string;
};
type SignInResponse = {
  id: string;
  firstName: string;
  lastName: string;
};
type AuthResponse = {
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async authenticate(input: AuthInput): Promise<AuthResponse> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    };
  }
  async validateUser(input: AuthInput): Promise<SignInResponse> {
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

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  }
}
