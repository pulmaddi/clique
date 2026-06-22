import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthPayload) {
    return this.users.getProfile(user.sub);
  }

  @Get('me/follows')
  follows(@CurrentUser() user: AuthPayload) {
    return this.users.listFollows(user.sub);
  }

  @Post('me/follows/:hostId')
  follow(@CurrentUser() user: AuthPayload, @Param('hostId') hostId: string) {
    return this.users.follow(user.sub, hostId);
  }

  @Delete('me/follows/:hostId')
  unfollow(@CurrentUser() user: AuthPayload, @Param('hostId') hostId: string) {
    return this.users.unfollow(user.sub, hostId);
  }
}
