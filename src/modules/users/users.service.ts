import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum, User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { BcryptService } from 'src/providers/bcrypt.service';
import { UsersFilters } from './dto/query/users-filters.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRep: Repository<User>,
    private readonly hashSer: BcryptService,
  ) {}

  async onModuleInit() {
    const usersCount = await this.usersRep.count();

    if (!usersCount) {
      const users: DeepPartial<User>[] = [
        {
          name: 'Miguel Alzate',
          username: 'Admin',
          email: 'alzatemiguel284@gmail.com',
          password: await this.hashSer.hash('123456'),
          role: RolesEnum.ADMIN,
        },
        {
          name: 'User',
          username: 'User',
          email: 'User@yopmail.com',
          password: await this.hashSer.hash('123456'),
        },
      ];

      const newUsers = this.usersRep.create(users);

      await this.usersRep.save(newUsers);
    }
  }

  async create(createUserDto: CreateUserDto) {
    let dataExists = await this.findOneByEmail(createUserDto.email);

    if (dataExists) throw new BadRequestException('Email already exists');

    dataExists = await this.findOneByUsername(createUserDto.username);

    if (dataExists) throw new BadRequestException('Username already exists');

    createUserDto.password = await this.hashSer.hash(createUserDto.password);

    const newUser = this.usersRep.create(createUserDto);

    return {
      ok: true,
      user: await this.usersRep.save(newUser),
    };
  }

  findOneByEmail(email: string) {
    return this.usersRep.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'username',
        'email',
        'password',
        'role',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
  }

  findOneByUsername(username: string) {
    return this.usersRep.findOne({ where: { username } });
  }

  async findAll(queryFilters: UsersFilters) {
    const query = this.usersRep.createQueryBuilder('users');

    const {
      data: users,
      total,
      limit,
      page,
    } = await queryFilters.getResponsePaginated(query, queryFilters);

    return {
      ok: true,
      users,
      total,
      limit,
      page,
    };
  }

  async findOne(id: string) {
    const user = await this.usersRep.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return {
      ok: true,
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    await this.usersRep.update(id, updateUserDto);

    return {
      ok: true,
      message: 'User updated successfully',
    };
  }

  async remove(id: string) {
    const { user } = await this.findOne(id);

    await this.usersRep.softRemove(user);

    return {
      ok: true,
      message: 'User deleted successfully',
    };
  }
}
