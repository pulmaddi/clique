import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthPayload) {
    return this.notifications.list(user.sub);
  }

  @Post(':id/read')
  markRead(@CurrentUser() user: AuthPayload, @Param('id') id: string) {
    return this.notifications.markRead(user.sub, id);
  }
}
