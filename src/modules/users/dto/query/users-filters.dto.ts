import { FiltersPaginated } from 'src/global/dto/filters-paginated.dto';
import { RolesEnum } from '../../entities/user.entity';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UsersFilters extends FiltersPaginated {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  name: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  username: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsEnum(RolesEnum)
  role: RolesEnum;
}
