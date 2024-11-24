import { RolesEnum } from 'src/modules/users/entities/user.entity';

export interface PayloadToken {
  id: string;
  role: RolesEnum;
}
