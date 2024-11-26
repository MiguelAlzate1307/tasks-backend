import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ActionsEnum {
  REGISTER = 'Register',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  POST = 'Create',
  GET = 'List',
  PATCH = 'Update',
  DELETE = 'Delete',
}

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActionsEnum })
  action: ActionsEnum;

  @Column({ type: 'varchar', length: 13 })
  description: string;

  @ManyToOne(() => User, (user) => user.logs, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  module: string;

  @Column({ type: 'varchar', length: 6 })
  method: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'jsonb' })
  body: object;

  @Column({ type: 'jsonb' })
  response: object;

  @CreateDateColumn()
  created_at: Date;
}
