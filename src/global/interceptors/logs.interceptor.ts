import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { PayloadToken } from 'src/modules/iam/model/token.model';
import { ActionsEnum } from 'src/modules/logs/entities/log.entity';
import { LogsService } from 'src/modules/logs/logs.service';
import { logsMessages } from 'src/modules/logs/messages/logs.messages';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor(
    private readonly logsSer: LogsService,
    private readonly usersSer: UsersService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: async (response) => {
          const req: Request = context.switchToHttp().getRequest();

          if (req.body.password) delete req.body.password;

          let user: User = null;

          if (req.body.email)
            user = (await this.usersSer.findOneByEmail(req.body.email)) ?? null;

          if (req.user) {
            ({ user } = await this.usersSer.findOne(
              (req.user as PayloadToken).id,
            ));
          }

          await this.logsSer.create({
            action: this.getActionByMethodAndUrl(req.url, req.method),
            description:
              logsMessages[this.getActionByMethodAndUrl(req.url, req.method)],
            user,
            module: context.getClass().name,
            method: req.method,
            status: 200,
            url: req.url,
            body: req.body,
            response,
          });

          return response;
        },
        error: async (error) => {
          const req: Request = context.switchToHttp().getRequest();

          if (req.body.password) delete req.body.password;

          let user: User = null;

          if (req.body.email && !req.url.includes('register'))
            user = (await this.usersSer.findOneByEmail(req.body.email)) ?? null;

          if (req.user) {
            ({ user } = await this.usersSer.findOne(
              (req.user as PayloadToken).id,
            ));
          }

          await this.logsSer.create({
            action: this.getActionByMethodAndUrl(req.url, req.method),
            description:
              logsMessages[this.getActionByMethodAndUrl(req.url, req.method)],
            user,
            module: context.getClass().name,
            method: req.method,
            status: 200,
            url: req.url,
            body: req.body,
            response: error,
          });

          return error.response;
        },
      }),
    );
  }

  getActionByMethodAndUrl(url: string, method: string): ActionsEnum {
    if (url.includes('register')) return ActionsEnum.REGISTER;

    if (url.includes('login')) return ActionsEnum.LOGIN;

    if (url.includes('logout')) return ActionsEnum.LOGOUT;

    return ActionsEnum[method];
  }
}
