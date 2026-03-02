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
import { Provider } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: { id: number; email: string }) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  async registerLocal(dto: CreateUserDto) {
    const existing = await this.usersService.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      authProviders: {
        create: {
          provider: Provider.local,
          password: hashedPassword,
        },
      },
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const localAuth = user.authProviders.find(
      (p) => p.provider === Provider.local,
    );

    if (!localAuth || !localAuth.password) {
      throw new UnauthorizedException(
        'Please log in using your OAuth provider.',
      );
    }

    const isValid = await bcrypt.compare(dto.password, localAuth.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return this.signToken(user);
  }

  async oauthLogin(profile: { email: string }) {
    const user = await this.usersService.findOneByEmail(profile.email);

    if (!user) {
      await this.usersService.create({
        email: profile.email,
        authProviders: {
          create: {
            provider: Provider.google,
            provider_id: profile.email,
            password: null,
          },
        },
      });
    } else {
      const hasGoogle = user.authProviders.some(
        (p) => p.provider === Provider.google,
      );

      if (!hasGoogle) {
        await this.usersService.addProvider(user.id, {
          provider: Provider.google,
          provider_id: profile.email,
        });
      }
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signToken(user);
  }
}
