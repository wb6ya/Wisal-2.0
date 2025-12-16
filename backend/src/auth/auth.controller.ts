// src/auth/auth.controller.ts

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // رابط تسجيل الدخول
  @Post('login')
  @HttpCode(HttpStatus.OK) // إرجاع كود 200 بدلاً من 201
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
