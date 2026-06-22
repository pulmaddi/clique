import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HostsModule } from './modules/hosts/hosts.module';
import { OccasionsModule } from './modules/occasions/occasions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HostsModule,
    OccasionsModule,
    PaymentsModule,
    RealtimeModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
