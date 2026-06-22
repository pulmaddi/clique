import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { ZodValidate } from '../../common/zod-validate.decorator';
import {
  createHostSchema,
  type CreateHostDto,
} from '@bhakti-setu/shared';
import type { AuthPayload } from '../auth/jwt-auth.guard';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hosts: HostsService) {}

  @Get()
  list(@Query('q') q?: string, @Query('language') language?: string) {
    return this.hosts.list({ q, language });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.hosts.get(id);
  }

  @Get(':id/occasions')
  occasions(@Param('id') id: string) {
    return this.hosts.upcomingOccasions(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ZodValidate(createHostSchema)
  create(@CurrentUser() user: AuthPayload, @Body() body: CreateHostDto) {
    return this.hosts.create(user.sub, body);
  }
}
