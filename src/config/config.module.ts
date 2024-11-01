import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

import { validate } from '@/config/config.validation';
import databaseConfig from '@/config/variables/database.config';
import jwtConfig from '@/config/variables/jwt.config';
import serverConfig from '@/config/variables/server.config';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [serverConfig, jwtConfig, databaseConfig],
      validate,
    }),
  ],
})
export class ConfigModule {}
