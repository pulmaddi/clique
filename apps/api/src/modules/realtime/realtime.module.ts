import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OccasionsModule } from '../occasions/occasions.module';
import { LivekitService } from './livekit.service';
import { RealtimeController } from './realtime.controller';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [AuthModule, OccasionsModule],
  controllers: [RealtimeController],
  providers: [LivekitService, RealtimeGateway],
})
export class RealtimeModule {}
