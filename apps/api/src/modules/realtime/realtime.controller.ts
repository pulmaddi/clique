import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { OccasionsService } from '../occasions/occasions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { ZodValidate } from '../../common/zod-validate.decorator';
import {
  joinRoomSchema,
  OccasionFormat,
  type JoinRoomDto,
  type RoomAccessToken,
} from '@bhakti-setu/shared';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('rooms')
export class RealtimeController {
  constructor(
    private readonly livekit: LivekitService,
    private readonly occasions: OccasionsService,
  ) {}

  /**
   * Mint a room token after server-side access checks (free / subscriber /
   * paid). Publish rights depend on the occasion format.
   */
  @Post('join')
  @UseGuards(JwtAuthGuard)
  @ZodValidate(joinRoomSchema)
  async join(
    @CurrentUser() user: AuthPayload,
    @Body() body: JoinRoomDto,
  ): Promise<RoomAccessToken> {
    const instance = await this.occasions.assertCanJoin(
      user.sub,
      body.occasionInstanceId,
    );

    // In BROADCAST mode only the host publishes; participants subscribe.
    const isInteractive =
      instance.occasion.format === OccasionFormat.INTERACTIVE;
    const roomName = instance.roomName ?? `occ-${instance.id}`;

    const token = await this.livekit.createToken({
      roomName,
      identity: user.sub,
      canPublish: isInteractive,
    });

    return {
      roomName,
      token,
      livekitUrl: this.livekit.url,
      canPublish: isInteractive,
    };
  }
}
