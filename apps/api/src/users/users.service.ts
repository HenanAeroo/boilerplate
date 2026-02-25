import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {
    this.usersRepo = usersRepo;
  }
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create(createUserDto);
    return await this.usersRepo.save(user);
  }

  async findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: number) {
    const user = (await this.usersRepo.findOneBy({ id })) || null;

    if (user === null) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepo.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepo.delete(id);
  }
}
