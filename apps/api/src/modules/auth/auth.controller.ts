import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  registerSchema,
  requestOtpSchema,
  verifyOtpSchema,
  type RegisterDto,
  type RequestOtpDto,
  type VerifyOtpDto,
} from '@bhakti-setu/shared';
import { ZodValidate } from '../../common/zod-validate.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  @ZodValidate(requestOtpSchema)
  requestOtp(@Body() body: RequestOtpDto) {
    return this.auth.requestOtp(body.phone);
  }

  @Post('otp/verify')
  @ZodValidate(verifyOtpSchema)
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.auth.verifyOtp(body.phone, body.code);
  }

  @Post('register')
  @ZodValidate(registerSchema)
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }
}
