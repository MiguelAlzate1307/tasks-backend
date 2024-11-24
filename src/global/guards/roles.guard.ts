import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum, User } from 'src/modules/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const roles = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler,
    ]);

    if (!roles) return true;

    return roles.includes((req.user as User).role);
  }
}
