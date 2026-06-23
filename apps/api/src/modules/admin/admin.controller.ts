import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import {
  HostVerificationStatus,
  UserRole,
  createBroadcastSchema,
  type CreateBroadcastDto,
} from '@clique/shared';
import { ZodValidate } from '../../common/zod-validate.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get('hosts/pending')
  pendingHosts() {
    return this.admin.pendingHosts();
  }

  @Post('hosts/:id/verification')
  setVerification(
    @Param('id') id: string,
    @Body() body: { status: HostVerificationStatus; commissionPercent?: number },
  ) {
    return this.admin.setHostVerification(
      id,
      body.status,
      body.commissionPercent,
    );
  }

  @Get('metrics')
  metrics() {
    return this.admin.metrics();
  }

  // Admin-assisted broadcast on behalf of a host.
  @Post('hosts/:id/broadcast')
  @ZodValidate(createBroadcastSchema)
  broadcast(@Param('id') id: string, @Body() body: CreateBroadcastDto) {
    return this.notifications.broadcastToFollowers(
      id,
      body.title,
      body.body,
      body.segment,
    );
  }
}
