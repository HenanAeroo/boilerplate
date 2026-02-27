import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const localAuth = user.authProviders.find(
      (provider) => provider.provider === 'local',
    );
    const oauthAuth = user.authProviders.find(
      (provider) => provider.provider !== 'local',
    );

    if (oauthAuth && !localAuth) {
      throw new UnauthorizedException(
        `Please log in using your ${oauthAuth.provider} account.`,
      );
    }

    if (!localAuth || !localAuth.password) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      localAuth.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
