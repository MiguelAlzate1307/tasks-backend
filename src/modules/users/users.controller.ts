import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IdParamDto } from 'src/global/dto/id-param.dto';
import { UsersFilters } from './dto/query/users-filters.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/global/guards/roles.guard';
import { RolesEnum } from './entities/user.entity';
import { Roles } from 'src/global/decorators/roles.decorator';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() queryFilters: UsersFilters) {
    return this.usersService.findAll(queryFilters);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.update(id, updateUserRoleDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto) {
    return this.usersService.remove(id);
  }
}
