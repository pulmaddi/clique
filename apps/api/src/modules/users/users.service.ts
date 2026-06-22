import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async follow(userId: string, hostId: string) {
    await this.prisma.follow.upsert({
      where: { userId_hostId: { userId, hostId } },
      update: {},
      create: { userId, hostId },
    });
    await this.prisma.host.update({
      where: { id: hostId },
      data: { followerCount: { increment: 1 } },
    });
    return { following: true };
  }

  async unfollow(userId: string, hostId: string) {
    const deleted = await this.prisma.follow.deleteMany({
      where: { userId, hostId },
    });
    if (deleted.count > 0) {
      await this.prisma.host.update({
        where: { id: hostId },
        data: { followerCount: { decrement: 1 } },
      });
    }
    return { following: false };
  }

  listFollows(userId: string) {
    return this.prisma.follow.findMany({
      where: { userId },
      include: { host: true },
    });
  }
}
