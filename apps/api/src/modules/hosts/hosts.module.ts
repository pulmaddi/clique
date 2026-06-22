import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

@Module({
  imports: [AuthModule],
  controllers: [HostsController],
  providers: [HostsService],
  exports: [HostsService],
})
export class HostsModule {}
