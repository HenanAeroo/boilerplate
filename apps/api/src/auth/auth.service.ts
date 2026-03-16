import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Provider } from '../../prisma/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
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
}
