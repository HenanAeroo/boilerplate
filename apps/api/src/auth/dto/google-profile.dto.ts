import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  sub: string; // identifiant unique Google

  @IsOptional()
  @IsString()
  first_name?: string | null;

  @IsOptional()
  @IsString()
  last_name?: string | null;
}
