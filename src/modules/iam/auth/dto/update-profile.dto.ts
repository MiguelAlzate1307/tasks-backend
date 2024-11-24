import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  name?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  username?: string;
}
