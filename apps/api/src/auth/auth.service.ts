import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Provider } from '../../prisma/generated/prisma/client';
import { GoogleProfile } from './interfaces/google-profile.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async generateToken(userId: number, userEmail: string): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
      email: userEmail,
    });
  }

  async localRegister(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        authProviders: {
          create: {
            provider: Provider.local,
            password: hashedPassword,
          },
        },
      },
    });

    const token = await this.generateToken(user.id, user.email);
    return { token };
  }

  async validateOAuthLogin(profile: GoogleProfile) {
    const email = profile.emails?.[0]?.value;
    const providerId = profile.id;

    if (!email) throw new Error('OAuth email missing');

    const existingProvider = await this.prisma.authProvider.findUnique({
      where: {
        provider_provider_id: {
          provider: Provider.google,
          provider_id: providerId,
        },
      },
      include: { user: true },
    });

    if (existingProvider) {
      return {
        token: await this.generateToken(
          existingProvider.user.id,
          existingProvider.user.email,
        ),
      };
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          first_name: profile.name?.givenName,
          last_name: profile.name?.familyName,
          authProviders: {
            create: { provider: Provider.google, provider_id: providerId },
          },
        },
      });
    } else {
      await this.prisma.authProvider.create({
        data: {
          provider: Provider.google,
          provider_id: providerId,
          userId: user.id,
        },
      });
    }

    return { token: await this.generateToken(user.id, user.email) };
  }
}
