import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomInt } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { RegisterDto } from '@bhakti-setu/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  /**
   * Generate and "send" an OTP. In production this hands off to an SMS
   * provider (e.g. MSG91 / Gupshup); here we persist a hashed code.
   */
  async requestOtp(phone: string): Promise<{ sent: boolean }> {
    const code = randomInt(100000, 999999).toString();
    const ttl = this.config.get<number>('OTP_TTL_SECONDS', 300);
    await this.prisma.otpCode.create({
      data: {
        phone,
        codeHash: this.hashCode(code),
        expiresAt: new Date(Date.now() + ttl * 1000),
      },
    });
    // TODO: integrate SMS gateway. For dev, log the code.
    // eslint-disable-next-line no-console
    console.log(`[dev] OTP for ${phone}: ${code}`);
    return { sent: true };
  }

  async verifyOtp(phone: string, code: string) {
    const record = await this.prisma.otpCode.findFirst({
      where: { phone, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.codeHash !== this.hashCode(code)) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { consumed: true },
    });

    const user = await this.prisma.user.findUnique({ where: { phone } });
    return {
      verified: true,
      isNewUser: !user,
      token: user ? this.issueToken(user.id, user.roles) : null,
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.upsert({
      where: { phone: dto.phone },
      update: { name: dto.name, language: dto.language },
      create: {
        phone: dto.phone,
        name: dto.name,
        language: dto.language,
        city: dto.city,
        state: dto.state,
      },
    });
    return { user, token: this.issueToken(user.id, user.roles) };
  }

  private issueToken(userId: string, roles: string[]): string {
    return this.jwt.sign({ sub: userId, roles });
  }
}
