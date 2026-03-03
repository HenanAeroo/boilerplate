import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from '../../prisma/generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(
    @Body()
    userData: {
      email: string;
      first_name?: string;
      last_name?: string;
    },
  ): Promise<UserModel> {
    const { email, first_name, last_name } = userData;
    return this.usersService.create({
      email,
      first_name,
      last_name,
    });
  }

  @Get()
  findAll(): Promise<UserModel[]> {
    return this.usersService.findAll({
      orderBy: { id: 'asc' },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserModel | null> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.usersService.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.remove({ id: Number(id) });
  }
}
