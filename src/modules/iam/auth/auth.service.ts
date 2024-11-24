import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from 'src/providers/bcrypt.service';
import { User } from 'src/modules/users/entities/user.entity';
import { PayloadToken } from '../model/token.model';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { DeepPartial } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersSer: UsersService,
    private readonly hashSer: BcryptService,
    private readonly jwtSer: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const {
      user: { password, ...user },
    } = await this.usersSer.create(createUserDto);

    return await this.generateJwt(user);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersSer.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await this.hashSer.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Incorrect password');

    const { password: pass, ...result } = user;

    return {
      ok: true,
      user: result,
    };
  }

  async generateJwt(user: DeepPartial<User>) {
    const data: PayloadToken = { id: user.id, role: user.role };

    const accessToken = await this.jwtSer.signAsync(data);

    return {
      ok: true,
      accessToken,
      user,
    };
  }

  async profile(user: User) {
    const { user: result } = await this.usersSer.findOne(user.id);

    return {
      ok: true,
      user: result,
    };
  }

  async updateProfile(user: User, updateProfileDto: UpdateProfileDto) {
    return await this.usersSer.update(user.id, updateProfileDto);
  }
}
