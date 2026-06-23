import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@clique/shared';

export const ROLES_KEY = 'roles';

/** Restrict a route to one or more roles (used with RolesGuard). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
