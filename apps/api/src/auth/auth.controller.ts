import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalRegisterDto } from './dto/local-register.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() localRegisterDto: LocalRegisterDto) {
    const email = localRegisterDto.email;
    const password = localRegisterDto.password;

    if (!email || !password) {
      throw new BadRequestException('Email et mot de passe sont requis');
    }

    return this.authService.localRegister(email, password);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() localLoginDto: LocalLoginDto) {
  //   return this.authService.update(+id, localLoginDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
