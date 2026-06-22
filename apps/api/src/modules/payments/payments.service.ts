import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from './razorpay.service';
import { splitEarnings } from '@bhakti-setu/shared';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpay: RazorpayService,
  ) {}

  /**
   * Begin a pay-per-event checkout. Creates a local Payment (CREATED) plus a
   * Razorpay order; the mobile app completes Checkout with the returned order.
   */
  async startEventCheckout(params: {
    userId: string;
    occasionInstanceId: string;
    amountPaise: number;
    idempotencyKey: string;
  }) {
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) return existing;

    const order = await this.razorpay.createOrder(
      params.amountPaise,
      `evt_${params.occasionInstanceId}`,
    );

    return this.prisma.payment.create({
      data: {
        userId: params.userId,
        amountPaise: params.amountPaise,
        currency: 'INR',
        status: 'CREATED',
        razorpayOrderId: order.id,
        idempotencyKey: params.idempotencyKey,
      },
    });
  }

  /**
   * Handle a verified Razorpay webhook. Idempotent: a captured event confirms
   * the payment, records the ledger split, and confirms related bookings.
   */
  async handleWebhook(event: string, payload: any) {
    if (event !== 'payment.captured') {
      this.logger.debug(`Ignoring webhook event: ${event}`);
      return { handled: false };
    }

    const entity = payload?.payment?.entity;
    const orderId: string | undefined = entity?.order_id;
    const paymentId: string | undefined = entity?.id;
    if (!orderId) return { handled: false };

    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { bookings: { include: { instance: { include: { occasion: true } } } } },
    });
    if (!payment) throw new NotFoundException('Unknown order');
    if (payment.status === 'CAPTURED') return { handled: true }; // idempotent

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'CAPTURED', razorpayPaymentId: paymentId },
      });

      // Confirm bookings tied to this payment.
      await tx.booking.updateMany({
        where: { paymentId: payment.id },
        data: { status: 'CONFIRMED' },
      });

      // Record ledger split for the host of the first related occasion.
      const hostId =
        payment.bookings[0]?.instance.occasion.hostId ?? undefined;
      if (hostId) {
        const host = await tx.host.findUnique({ where: { id: hostId } });
        const split = splitEarnings(
          payment.amountPaise,
          host?.commissionPercent,
        );
        await tx.ledgerEntry.create({
          data: {
            paymentId: payment.id,
            hostId,
            grossPaise: split.gross,
            commissionPaise: split.commission,
            hostNetPaise: split.hostNet,
          },
        });
      }
    });

    return { handled: true };
  }
}
