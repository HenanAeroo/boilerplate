import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerLocal(dto: CreateUserDto) {
    const existing = await this.usersService.findOneByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersService.createWithProvider({
      ...dto,
      provider: 'local',
      password: hashedPassword,
    });
  }

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

  async oauthLogin(oauthProfile: {
    email: string;
    first_name?: string;
    last_name?: string;
  }) {
    let user = await this.usersService.findOneByEmail(oauthProfile.email);

    if (!user) {
      await this.usersService.createWithProvider({
        email: oauthProfile.email,
        provider: 'google',
        first_name: oauthProfile.first_name || '',
        last_name: oauthProfile.last_name || '',
        password: null,
      });
      user = await this.usersService.findOneByEmail(oauthProfile.email);
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
