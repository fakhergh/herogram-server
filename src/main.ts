import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

import { AppModule } from '@/app.module';
import { EnvironmentVariables } from '@/config/config.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.use(
    morgan('dev', {
      stream: {
        write: function (str) {
          Logger.log(str, 'Request');
        },
      },
    }),
  );
  app.enableCors();

  const port = config.get<EnvironmentVariables['server']>('server').port;

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Herogram API')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}

bootstrap();
