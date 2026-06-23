import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import type { UserRole } from '@clique/shared';
import type { AuthPayload } from '../modules/auth/jwt-auth.guard';

/** Checks the authenticated user's roles against @Roles() metadata. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const user: AuthPayload | undefined = context
      .switchToHttp()
      .getRequest().user;
    return !!user && required.some((r) => user.roles.includes(r));
  }
}
