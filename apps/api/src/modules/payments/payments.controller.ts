import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly razorpay: RazorpayService,
  ) {}

  @Post('event-checkout')
  @UseGuards(JwtAuthGuard)
  startEventCheckout(
    @CurrentUser() user: AuthPayload,
    @Body()
    body: {
      occasionInstanceId: string;
      amountPaise: number;
      idempotencyKey: string;
    },
  ) {
    return this.payments.startEventCheckout({ userId: user.sub, ...body });
  }

  /**
   * Razorpay webhook. Must be reachable without auth, but every payload is
   * signature-verified. Requires the raw request body (see main.ts raw config
   * note in DEVELOPMENT.md).
   */
  @Post('webhook')
  @HttpCode(200)
  webhook(
    @Req() req: Request & { rawBody?: string },
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: { event: string; payload: any },
  ) {
    const raw = req.rawBody ?? JSON.stringify(body);
    if (!this.razorpay.verifyWebhookSignature(raw, signature)) {
      return { ok: false, reason: 'invalid signature' };
    }
    return this.payments.handleWebhook(body.event, body.payload);
  }
}
