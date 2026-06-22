import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthPayload } from '../modules/auth/jwt-auth.guard';

/** Injects the authenticated user payload set by JwtAuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPayload => {
    return ctx.switchToHttp().getRequest().user;
  },
);
