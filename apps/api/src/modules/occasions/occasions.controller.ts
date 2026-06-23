import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OccasionsService } from './occasions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { ZodValidate } from '../../common/zod-validate.decorator';
import {
  createBookingSchema,
  createOccasionSchema,
  type CreateBookingDto,
  type CreateOccasionDto,
} from '@clique/shared';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('occasions')
export class OccasionsController {
  constructor(private readonly occasions: OccasionsService) {}

  @Get('upcoming')
  upcoming(@Query('hostId') hostId?: string) {
    return this.occasions.upcoming(hostId);
  }

  // NOTE: hostId is resolved from the authenticated host membership in a
  // real impl; passed as a query here for the scaffold.
  @Post()
  @UseGuards(JwtAuthGuard)
  @ZodValidate(createOccasionSchema)
  create(@Query('hostId') hostId: string, @Body() body: CreateOccasionDto) {
    return this.occasions.create(hostId, body);
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ZodValidate(createBookingSchema)
  book(@CurrentUser() user: AuthPayload, @Body() body: CreateBookingDto) {
    return this.occasions.book(user.sub, body);
  }
}
