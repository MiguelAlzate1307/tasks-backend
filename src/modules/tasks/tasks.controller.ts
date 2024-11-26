import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { PayloadToken } from '../iam/model/token.model';
import { TasksFiltersDto } from './dto/query/tasks-filters.dto';
import { IdParamDto } from 'src/global/dto/id-param.dto';
import { Roles } from 'src/global/decorators/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';
import { RolesGuard } from 'src/global/guards/roles.guard';

@Roles(RolesEnum.USER)
@UseGuards(RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return this.tasksService.create(createTaskDto, req.user as PayloadToken);
  }

  @Get()
  findAll(@Query() queryFilters: TasksFiltersDto, @Req() req: Request) {
    return this.tasksService.findAll(queryFilters, req.user as PayloadToken);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto, @Req() req: Request) {
    return this.tasksService.findOne(id, req.user as PayloadToken);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user as PayloadToken,
    );
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto, @Req() req: Request) {
    return this.tasksService.remove(id, req.user as PayloadToken);
  }
}
