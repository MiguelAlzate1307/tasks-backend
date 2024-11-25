import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsFilters } from './dto/query/logs-filters.dto';
import { IdParamDto } from 'src/global/dto/id-param.dto';
import { Roles } from 'src/global/decorators/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';
import { RolesGuard } from 'src/global/guards/roles.guard';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query() queryFilters: LogsFilters) {
    return this.logsService.findAll(queryFilters);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.logsService.findOne(id);
  }

  @Delete()
  remove() {
    return this.logsService.remove();
  }
}
