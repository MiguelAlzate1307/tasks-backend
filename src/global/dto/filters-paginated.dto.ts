import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { SelectQueryBuilder } from 'typeorm';

export class FiltersPaginated {
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;

  async getResponsePaginated(
    query: SelectQueryBuilder<User>,
    { limit = 10, page = 1, ...filters }: FiltersPaginated,
  ) {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'name')
        query.andWhere(
          `${query.expressionMap.mainAlias.name}.${key} LIKE :${key}`,
          {
            [key]: value,
          },
        );
      else
        query.andWhere(
          `${query.expressionMap.mainAlias.name}.${key} = :${key}`,
          {
            [key]: value,
          },
        );
    }

    query.take(limit);
    query.skip((page - 1) * limit);

    const [data, total] = await query.getManyAndCount();

    return {
      ok: true,
      data,
      total,
      limit,
      page,
    };
  }
}
