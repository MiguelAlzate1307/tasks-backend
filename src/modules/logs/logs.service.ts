import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { LogsFilters } from './dto/query/logs-filters.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRep: Repository<Log>,
  ) {}

  async create(createLogDto: CreateLogDto) {
    const newLog = this.logsRep.create(createLogDto);

    return {
      ok: true,
      log: await this.logsRep.save(newLog),
    };
  }

  async findAll(queryFilters: LogsFilters) {
    const query = this.logsRep.createQueryBuilder('logs');

    const {
      data: logs,
      total,
      limit,
      page,
    } = await queryFilters.getResponsePaginated(query, queryFilters);

    return {
      ok: true,
      logs,
      total,
      limit,
      page,
    };
  }

  async findOne(id: string) {
    const log = await this.logsRep.findOne({ where: { id } });

    if (!log) throw new NotFoundException('Log not found');

    return {
      ok: true,
      log,
    };
  }

  async remove() {
    const logs = await this.logsRep.find();

    await this.logsRep.remove(logs);

    return {
      ok: true,
      message: 'All logs deleted successfully',
    };
  }
}
