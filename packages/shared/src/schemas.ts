// Zod validation schemas for API DTOs. Reused on the client for form validation.

import { z } from 'zod';
import {
  AccessType,
  HostType,
  OccasionFormat,
  OccasionType,
  RecurrenceType,
  SupportedLanguage,
} from './enums';

const indianPhone = z
  .string()
  .regex(/^\+91[6-9]\d{9}$/, 'Must be a valid +91 mobile number');

export const requestOtpSchema = z.object({
  phone: indianPhone,
});

export const verifyOtpSchema = z.object({
  phone: indianPhone,
  code: z.string().length(6),
});

export const registerSchema = z.object({
  phone: indianPhone,
  name: z.string().min(2).max(80),
  language: z.nativeEnum(SupportedLanguage),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
});

export const createHostSchema = z.object({
  type: z.nativeEnum(HostType),
  name: z.string().min(2).max(120),
  about: z.string().max(2000).optional(),
  language: z.nativeEnum(SupportedLanguage),
  tradition: z.string().max(80).optional(),
  deity: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
});

export const createOccasionSchema = z
  .object({
    type: z.nativeEnum(OccasionType),
    title: z.string().min(2).max(160),
    description: z.string().max(4000).optional(),
    language: z.nativeEnum(SupportedLanguage),
    format: z.nativeEnum(OccasionFormat),
    access: z.nativeEnum(AccessType),
    pricePaise: z.number().int().positive().optional(),
    recurrence: z.nativeEnum(RecurrenceType),
    startsAt: z.string().datetime(),
    durationMinutes: z.number().int().min(5).max(720),
    festivalTag: z.string().max(80).optional(),
  })
  .refine((v) => v.access !== AccessType.PAID || v.pricePaise != null, {
    message: 'pricePaise is required when access is PAID',
    path: ['pricePaise'],
  });

export const sankalpaSchema = z.object({
  name: z.string().min(2).max(120),
  gotra: z.string().max(80).optional(),
  place: z.string().max(120).optional(),
  intention: z.string().max(500).optional(),
});

export const createBookingSchema = z.object({
  occasionInstanceId: z.string().uuid(),
  sankalpa: sankalpaSchema.optional(),
  offeringIds: z.array(z.string().uuid()).default([]),
});

export const joinRoomSchema = z.object({
  occasionInstanceId: z.string().uuid(),
});

export const createBroadcastSchema = z.object({
  title: z.string().min(2).max(160),
  body: z.string().min(1).max(4000),
  mediaUrl: z.string().url().optional(),
  segment: z.enum(['ALL', 'SUBSCRIBERS']).default('ALL'),
});

// Inferred request types
export type RequestOtpDto = z.infer<typeof requestOtpSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type CreateHostDto = z.infer<typeof createHostSchema>;
export type CreateOccasionDto = z.infer<typeof createOccasionSchema>;
export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type JoinRoomDto = z.infer<typeof joinRoomSchema>;
export type CreateBroadcastDto = z.infer<typeof createBroadcastSchema>;
