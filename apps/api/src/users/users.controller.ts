import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll({});
  }

  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.usersService.findOneById({ id });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove({ id });
  }
}
