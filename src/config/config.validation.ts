import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

import { Environment } from '@/common/types/env.type';

class EnvironmentVariablesValidation {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  HOSTNAME: string;

  @IsNotEmpty()
  @IsString()
  MONGO_DB_DSN: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_TOKEN_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsOptional()
  @IsNumber()
  PASSWORD_HASH_SALT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariablesValidation,
    config,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipNullProperties: false,
    skipUndefinedProperties: false,
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
