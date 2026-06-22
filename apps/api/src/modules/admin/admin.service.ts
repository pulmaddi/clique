import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HostVerificationStatus } from '@bhakti-setu/shared';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  pendingHosts() {
    return this.prisma.host.findMany({
      where: { verificationStatus: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });
  }

  setHostVerification(
    hostId: string,
    status: HostVerificationStatus,
    commissionPercent?: number,
  ) {
    return this.prisma.host.update({
      where: { id: hostId },
      data: {
        verificationStatus: status,
        ...(commissionPercent != null ? { commissionPercent } : {}),
      },
    });
  }

  async metrics() {
    const [users, hosts, occasions, captured] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.host.count({ where: { verificationStatus: 'APPROVED' } }),
      this.prisma.occasion.count(),
      this.prisma.payment.aggregate({
        where: { status: 'CAPTURED' },
        _sum: { amountPaise: true },
      }),
    ]);
    return {
      users,
      approvedHosts: hosts,
      occasions,
      grossPaise: captured._sum.amountPaise ?? 0,
    };
  }
}
