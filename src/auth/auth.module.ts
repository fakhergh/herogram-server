import { Module } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/config/config.type';
import { JwtModule } from '@nestjs/jwt';
import { SessionsModule } from '@/sessions/sessions.module';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<EnvironmentVariables['jwt']>('jwt');
        return {
          global: true,
          secret: config.accessTokenSecretKey,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        };
      },
      inject: [ConfigService],
    }),
    SessionsModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
