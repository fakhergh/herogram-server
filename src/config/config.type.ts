import { Environment } from '@/common/types/env.type';

export type EnvironmentVariables = {
  server: {
    env: Environment;
    port: number;
    hostname: string;
  };
  jwt: {
    accessTokenSecretKey: string;
    accessTokenExpiresIn: string;
  };
  database: {
    uri: string;
  };
};
