import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ActionsEnum } from '../entities/log.entity';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateLogDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @IsEnum(ActionsEnum)
  action: ActionsEnum;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @MaxLength(13)
  description: string;

  @ValidateNested()
  @Type(() => User)
  user: User;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  module: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  method: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  status: number;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  url: string;

  @IsObject()
  @IsNotEmpty()
  body: object;

  @IsObject()
  @IsNotEmpty()
  response: object;
}
