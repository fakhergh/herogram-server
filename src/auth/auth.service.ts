import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: Buffer | object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
