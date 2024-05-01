import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
  }

  @Post("login")
  login(@Body() credentials: LoginUserDto) {
    return this.authService.login(credentials);
  }
}
