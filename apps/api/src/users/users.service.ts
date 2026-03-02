import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma/';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
      include: { authProviders: true },
    });
  }

  async createWithProvider(
    createUserDto: CreateUserDto,
    data: Prisma.AuthProviderCreateWithoutUserInput,
  ) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        authProviders: {
          create: {
            provider: data.provider,
            provider_id: data.provider_id,
            password: data.password,
            created_at: data.created_at,
          },
        },
      },
      include: { authProviders: true },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      cursor: params.cursor,
      where: params.where,
      orderBy: params.orderBy,
    });
  }

  async findOneById(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { authProviders: true },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { authProviders: true },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async addProvider(
    userId: number,
    data: Prisma.AuthProviderCreateWithoutUserInput,
  ) {
    return this.prisma.authProvider.create({
      data: {
        ...data,
        userId,
      },
    });
  }
}
