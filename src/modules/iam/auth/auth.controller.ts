import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { IsPublic } from 'src/global/decorators/is-public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request } from 'express';
import { User } from 'src/modules/users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSer: AuthService) {}

  @IsPublic()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authSer.register(createUserDto);
  }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authSer.generateJwt(req.user as User);
  }

  @Get('profile')
  profile(@Req() req: Request) {
    return this.authSer.profile(req.user as User);
  }

  @Patch('profile')
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authSer.updateProfile(req.user as User, updateProfileDto);
  }
}
