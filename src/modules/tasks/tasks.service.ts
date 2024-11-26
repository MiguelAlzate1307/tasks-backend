import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PayloadToken } from '../iam/model/token.model';
import { TasksFiltersDto } from './dto/query/tasks-filters.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRep: Repository<Task>,
    private readonly usersSer: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, payload: PayloadToken) {
    const { user } = await this.usersSer.findOne(payload.id);

    const newTask = this.tasksRep.create({ ...createTaskDto, user });

    return {
      ok: true,
      task: await this.tasksRep.save(newTask),
    };
  }

  async findAll(queryFilters: TasksFiltersDto, payload: PayloadToken) {
    const query = this.tasksRep.createQueryBuilder('tasks');

    query.andWhere('tasks.user_id = :user_id', { user_id: payload.id });

    const {
      data: tasks,
      total,
      limit,
      page,
    } = await queryFilters.getResponsePaginated(query, queryFilters);

    return {
      ok: true,
      tasks,
      total,
      limit,
      page,
    };
  }

  async findOne(id: string, payload: PayloadToken) {
    const task = await this.tasksRep.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task.user.id !== payload.id)
      throw new UnauthorizedException('This task does not belong to you');

    return {
      ok: true,
      task,
    };
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    payload: PayloadToken,
  ) {
    await this.findOne(id, payload);

    await this.tasksRep.update(id, updateTaskDto);

    return {
      ok: true,
      message: 'Task updated successfully',
    };
  }

  async remove(id: string, payload: PayloadToken) {
    const { task } = await this.findOne(id, payload);

    await this.tasksRep.softRemove(task);

    return {
      ok: true,
      message: 'Task deleted successfully',
    };
  }
}
