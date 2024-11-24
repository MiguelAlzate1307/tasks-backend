import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
