// Core domain entity shapes shared between API and mobile.
// These mirror the Prisma models but are framework-agnostic.

import type {
  AccessType,
  BookingStatus,
  HostType,
  HostVerificationStatus,
  OccasionFormat,
  OccasionType,
  PaymentStatus,
  PayoutStatus,
  RecurrenceType,
  SubscriptionStatus,
  SupportedLanguage,
  UserRole,
} from './enums';

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  name: string;
  photoUrl?: string | null;
  language: SupportedLanguage;
  city?: string | null;
  state?: string | null;
  roles: UserRole[];
  createdAt: string;
}

export interface Host {
  id: string;
  type: HostType;
  name: string;
  about?: string | null;
  avatarUrl?: string | null;
  language: SupportedLanguage;
  city?: string | null;
  state?: string | null;
  tradition?: string | null; // sampradaya
  deity?: string | null;
  verificationStatus: HostVerificationStatus;
  commissionPercent: number;
  followerCount: number;
  createdAt: string;
}

export interface Occasion {
  id: string;
  hostId: string;
  type: OccasionType;
  title: string;
  description?: string | null;
  language: SupportedLanguage;
  format: OccasionFormat;
  access: AccessType;
  pricePaise?: number | null; // required when access === PAID
  recurrence: RecurrenceType;
  startsAt: string;
  durationMinutes: number;
  festivalTag?: string | null;
  coverUrl?: string | null;
}

/** A concrete dated instance of a (possibly recurring) occasion. */
export interface OccasionInstance {
  id: string;
  occasionId: string;
  startsAt: string;
  endsAt: string;
  roomId?: string | null;
  recordingUrl?: string | null;
}

/** Ritual-specific structure layered on a RITUAL occasion. */
export interface RitualStep {
  order: number;
  title: string;
  description?: string;
}

export interface RitualOffering {
  id: string;
  label: string;
  pricePaise: number; // 0 = free
}

export interface SankalpaData {
  name: string;
  gotra?: string;
  place?: string;
  intention?: string;
}

export interface Booking {
  id: string;
  userId: string;
  occasionInstanceId: string;
  status: BookingStatus;
  sankalpa?: SankalpaData | null;
  offeringIds: string[];
  createdAt: string;
}

export interface SubscriptionTier {
  id: string;
  hostId: string;
  name: string;
  pricePaise: number;
  interval: 'monthly' | 'yearly';
  benefits: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  hostId: string;
  tierId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}

export interface Payment {
  id: string;
  userId: string;
  amountPaise: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  gstPaise: number;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  paymentId: string;
  hostId: string;
  grossPaise: number;
  commissionPaise: number;
  hostNetPaise: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  hostId: string;
  amountPaise: number;
  status: PayoutStatus;
  scheduledFor: string;
}

export interface Broadcast {
  id: string;
  hostId: string;
  title: string;
  body: string;
  mediaUrl?: string | null;
  sentAt: string;
}

/** Token + connection info returned when a devotee is admitted to a live room. */
export interface RoomAccessToken {
  roomName: string;
  token: string;
  livekitUrl: string;
  canPublish: boolean;
}
