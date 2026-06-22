import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OccasionsController } from './occasions.controller';
import { OccasionsService } from './occasions.service';

@Module({
  imports: [AuthModule],
  controllers: [OccasionsController],
  providers: [OccasionsService],
  exports: [OccasionsService],
})
export class OccasionsModule {}
