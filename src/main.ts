import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogsService } from './modules/logs/logs.service';
import { UsersService } from './modules/users/users.service';
import { LogsInterceptor } from './global/interceptors/logs.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logsSer = app.get(LogsService);
  const usersSer = app.get(UsersService);

  app.useGlobalInterceptors(new LogsInterceptor(logsSer, usersSer));

  await app.listen(3000);
}
bootstrap();
