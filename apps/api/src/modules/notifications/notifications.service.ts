import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Category = 'OCCASION' | 'BROADCAST' | 'PAYMENT' | 'GENERAL';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  /** Fan out a broadcast to a host's followers (or subscriber segment). */
  async broadcastToFollowers(
    hostId: string,
    title: string,
    body: string,
    segment: 'ALL' | 'SUBSCRIBERS',
  ) {
    const followerIds =
      segment === 'SUBSCRIBERS'
        ? (
            await this.prisma.subscription.findMany({
              where: { hostId, status: 'ACTIVE' },
              select: { userId: true },
            })
          ).map((s) => s.userId)
        : (
            await this.prisma.follow.findMany({
              where: { hostId },
              select: { userId: true },
            })
          ).map((f) => f.userId);

    if (followerIds.length === 0) return { delivered: 0 };

    await this.prisma.notification.createMany({
      data: followerIds.map((userId) => ({
        userId,
        title,
        body,
        category: 'BROADCAST' as Category,
      })),
    });
    // TODO: enqueue push delivery (FCM/APNs) via BullMQ.
    return { delivered: followerIds.length };
  }
}
