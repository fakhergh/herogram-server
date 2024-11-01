import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EnvironmentVariables } from '@/config/config.type';
import { JwtPayload } from '@/common/types/auth';
import { SessionsService } from '@/sessions/sessions.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
    private readonly sessionService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey:
        configService.get<EnvironmentVariables['jwt']>('jwt')
          .accessTokenSecretKey,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    const session = await this.sessionService.getSession(
      new Types.ObjectId(payload._id), //userId
      accessToken,
    );

    if (!session) throw new UnauthorizedException('Invalid token');

    return this.userService.getUserById(session.userId);
  }
}
