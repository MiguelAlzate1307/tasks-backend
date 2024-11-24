import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { IdParamDto } from 'src/global/dto/id-param.dto';
import { UsersFilters } from './dto/query/users-filters.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

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
}
