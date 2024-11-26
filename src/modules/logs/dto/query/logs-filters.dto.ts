import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { FiltersPaginated } from 'src/global/dto/filters-paginated.dto';
import { ActionsEnum } from '../../entities/log.entity';

export class LogsFilters extends FiltersPaginated {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsEnum(ActionsEnum)
  action?: ActionsEnum;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(100)
  module?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(6)
  method?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  status?: number;
}
