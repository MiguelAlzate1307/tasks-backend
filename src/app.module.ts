import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { IamModule } from './modules/iam/iam.module';
import config from './config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './modules/iam/guards/jwt-access.guard';
import { LogsModule } from './modules/logs/logs.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    UsersModule,
    IamModule,
    LogsModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
