import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import Razorpay from 'razorpay';

/**
 * Thin wrapper around the Razorpay SDK. Keeps all gateway specifics in one
 * place so the rest of the app deals only with our domain (paise, ledger).
 */
@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly client: Razorpay;
  private readonly webhookSecret: string;

  constructor(private readonly config: ConfigService) {
    this.client = new Razorpay({
      key_id: this.config.get<string>('RAZORPAY_KEY_ID', ''),
      key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET', ''),
    });
    this.webhookSecret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET', '');
  }

  /** Create a Razorpay order for a pay-per-event / ritual checkout. */
  async createOrder(amountPaise: number, receipt: string) {
    return this.client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      payment_capture: true,
    });
  }

  /** Verify the signature on an incoming webhook payload (raw body string). */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const expected = createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');
    return expected === signature;
  }
}
