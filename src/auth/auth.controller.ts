import {
  Body,
  Controller,
  Post,
  Req,
  ConflictException,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SessionsService } from '@/sessions/sessions.service';
import { UsersService } from '@/users/users.service';
import { compareHashAsync } from '@/utils/bcrypt.util';
import { LoginDto, RegisterDto } from '@/users/users.dto';
import { Request } from 'express';
import { AuthResponse } from '@/auth/auth.types';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly sessionService: SessionsService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    const userExists = await this.userService.checkUserExistenceByEmail(
      registerDto.email,
    );

    if (userExists) throw new ConflictException('Email already exists');

    const user = await this.userService.createUser(registerDto);

    const token = await this.authService.signAccessToken({
      _id: user._id.toString(),
    });

    await this.sessionService.createSession(user._id, token);

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.getUserByEmail(loginDto.email);

    if (!user) throw new NotFoundException('Invalid credentials');

    const isPasswordValid = await compareHashAsync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) throw new NotFoundException('Invalid credentials');

    const token = await this.authService.signAccessToken({
      _id: user._id.toString(),
    });

    await this.sessionService.createSession(user._id, token);

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.split('Bearer ')?.[1];
    const result = await this.sessionService.deleteSession(token);

    if (result.deletedCount === 0) throw new NotFoundException();

    return true;
  }
}
