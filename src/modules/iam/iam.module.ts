import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptService } from 'src/providers/bcrypt.service';
import { HashingService } from 'src/providers/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSer: ConfigService) => ({
        global: true,
        secret: configSer.get<string>('config.jwt.secret'),
        signOptions: {
          expiresIn: configSer.get<string>('config.jwt.expires'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: BcryptService,
      useClass: HashingService,
    },
    LocalStrategy,
    JwtAccessStrategy,
  ],
})
export class IamModule {}
