// Domain enums shared across API and mobile.
// Keep these in sync with prisma/schema.prisma enums.

export enum UserRole {
  DEVOTEE = 'DEVOTEE',
  HOST_OWNER = 'HOST_OWNER',
  CO_HOST = 'CO_HOST', // disciple / sevak / moderator
  ADMIN = 'ADMIN',
}

export enum HostType {
  TEMPLE = 'TEMPLE',
  GROUP = 'GROUP',
  GURU = 'GURU',
}

export enum HostVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum OccasionType {
  SATSANG = 'SATSANG',
  PRAVACHAN = 'PRAVACHAN',
  BHAJAN = 'BHAJAN',
  DARSHAN = 'DARSHAN',
  RITUAL = 'RITUAL',
  CUSTOM = 'CUSTOM',
}

export enum OccasionFormat {
  INTERACTIVE = 'INTERACTIVE', // limited speakers, raise-hand
  BROADCAST = 'BROADCAST', // large audience, host-only media
}

export enum AccessType {
  FREE = 'FREE',
  SUBSCRIBER = 'SUBSCRIBER',
  PAID = 'PAID', // pay-per-event / ritual
}

export enum RecurrenceType {
  ONE_OFF = 'ONE_OFF',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum SupportedLanguage {
  EN = 'en',
  HI = 'hi',
  TE = 'te',
}
