import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { FiltersPaginated } from 'src/global/dto/filters-paginated.dto';

export class TasksFiltersDto extends FiltersPaginated {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  title?: string;
}
