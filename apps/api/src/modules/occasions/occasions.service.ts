import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccessType } from '@clique/shared';
import type { CreateBookingDto, CreateOccasionDto } from '@clique/shared';

@Injectable()
export class OccasionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Feed of upcoming instances across all hosts (optionally a single host). */
  upcoming(hostId?: string) {
    return this.prisma.occasionInstance.findMany({
      where: {
        startsAt: { gte: new Date() },
        ...(hostId ? { occasion: { hostId } } : {}),
      },
      include: { occasion: { include: { host: true } } },
      orderBy: { startsAt: 'asc' },
      take: 50,
    });
  }

  async create(hostId: string, dto: CreateOccasionDto) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(startsAt.getTime() + dto.durationMinutes * 60_000);
    const occasion = await this.prisma.occasion.create({
      data: {
        hostId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        language: dto.language,
        format: dto.format,
        access: dto.access,
        pricePaise: dto.pricePaise ?? null,
        recurrence: dto.recurrence,
        startsAt,
        durationMinutes: dto.durationMinutes,
        festivalTag: dto.festivalTag,
        // First concrete instance. A scheduler later materializes recurring ones.
        instances: {
          create: {
            startsAt,
            endsAt,
            roomName: `occ-${Date.now()}`,
          },
        },
      },
      include: { instances: true },
    });
    return occasion;
  }

  /**
   * Book a seat / ticket for an instance. For FREE access this confirms
   * immediately; for PAID it creates a PENDING booking that the payments
   * module confirms on successful capture.
   */
  async book(userId: string, dto: CreateBookingDto) {
    const instance = await this.prisma.occasionInstance.findUnique({
      where: { id: dto.occasionInstanceId },
      include: { occasion: true },
    });
    if (!instance) throw new NotFoundException('Occasion instance not found');

    const { access } = instance.occasion;
    // For PAID access the booking stays PENDING here; the payments module
    // flips it to CONFIRMED once Razorpay capture is verified via webhook.

    return this.prisma.booking.upsert({
      where: {
        userId_occasionInstanceId: {
          userId,
          occasionInstanceId: dto.occasionInstanceId,
        },
      },
      update: { sankalpa: dto.sankalpa ?? undefined, offeringIds: dto.offeringIds },
      create: {
        userId,
        occasionInstanceId: dto.occasionInstanceId,
        status: access === AccessType.FREE ? 'CONFIRMED' : 'PENDING',
        sankalpa: dto.sankalpa ?? undefined,
        offeringIds: dto.offeringIds,
      },
    });
  }

  /** Verify a user is allowed into a live room (used by realtime token issuance). */
  async assertCanJoin(userId: string, occasionInstanceId: string) {
    const instance = await this.prisma.occasionInstance.findUnique({
      where: { id: occasionInstanceId },
      include: { occasion: true },
    });
    if (!instance) throw new NotFoundException('Occasion instance not found');

    const { occasion } = instance;
    if (occasion.access === AccessType.FREE) return instance;

    if (occasion.access === AccessType.SUBSCRIBER) {
      const sub = await this.prisma.subscription.findFirst({
        where: { userId, hostId: occasion.hostId, status: 'ACTIVE' },
      });
      if (!sub) throw new ForbiddenException('Subscription required');
      return instance;
    }

    // PAID
    const booking = await this.prisma.booking.findUnique({
      where: {
        userId_occasionInstanceId: { userId, occasionInstanceId },
      },
    });
    if (!booking || booking.status !== 'CONFIRMED') {
      throw new ForbiddenException('Paid ticket required');
    }
    return instance;
  }
}
