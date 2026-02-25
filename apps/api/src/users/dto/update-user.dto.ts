import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  email;

  @IsOptional()
  @IsString()
  password;

  @IsOptional()
  @IsString()
  first_name;

  @IsOptional()
  @IsString()
  last_name;
}
