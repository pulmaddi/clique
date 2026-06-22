import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DEFAULT_PLATFORM_COMMISSION_PERCENT } from '@bhakti-setu/shared';
import type { CreateHostDto } from '@bhakti-setu/shared';

@Injectable()
export class HostsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public discovery — only approved hosts are listed. */
  list(params: { q?: string; language?: string }) {
    return this.prisma.host.findMany({
      where: {
        verificationStatus: 'APPROVED',
        ...(params.language ? { language: params.language } : {}),
        ...(params.q
          ? { name: { contains: params.q, mode: 'insensitive' } }
          : {}),
      },
      orderBy: { followerCount: 'desc' },
      take: 50,
    });
  }

  async get(id: string) {
    const host = await this.prisma.host.findUnique({
      where: { id },
      include: { tiers: true },
    });
    if (!host) throw new NotFoundException('Host not found');
    return host;
  }

  /** A devotee applies to become a host; starts in PENDING until admin approval. */
  async create(ownerUserId: string, dto: CreateHostDto) {
    return this.prisma.host.create({
      data: {
        type: dto.type,
        name: dto.name,
        about: dto.about,
        language: dto.language,
        tradition: dto.tradition,
        deity: dto.deity,
        city: dto.city,
        state: dto.state,
        commissionPercent: DEFAULT_PLATFORM_COMMISSION_PERCENT,
        members: { create: { userId: ownerUserId, role: 'HOST_OWNER' } },
      },
    });
  }

  upcomingOccasions(hostId: string) {
    return this.prisma.occasion.findMany({
      where: { hostId, startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
    });
  }
}
