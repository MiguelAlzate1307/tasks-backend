import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RolesEnum } from '../entities/user.entity';
import { Transform } from 'class-transformer';

export class UpdateUserRoleDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: RolesEnum;
}
