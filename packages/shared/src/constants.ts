// Platform-wide constants. Money is always in minor units (paise) as integers.

export const DEFAULT_CURRENCY = 'INR';

/** Default platform commission retained from host earnings, in percent. */
export const DEFAULT_PLATFORM_COMMISSION_PERCENT = 15;

/** OTP time-to-live in seconds. */
export const OTP_TTL_SECONDS = 300;

/** Supported UI languages at launch. */
export const LAUNCH_LANGUAGES = ['en', 'hi', 'te'] as const;

/** One rupee in paise. Always store/compute money in paise. */
export const PAISE_PER_RUPEE = 100;

export const rupeesToPaise = (rupees: number): number =>
  Math.round(rupees * PAISE_PER_RUPEE);

export const paiseToRupees = (paise: number): number => paise / PAISE_PER_RUPEE;

/** Compute commission + host net split for a gross amount (in paise). */
export function splitEarnings(
  grossPaise: number,
  commissionPercent: number = DEFAULT_PLATFORM_COMMISSION_PERCENT,
): { gross: number; commission: number; hostNet: number } {
  const commission = Math.round((grossPaise * commissionPercent) / 100);
  return { gross: grossPaise, commission, hostNet: grossPaise - commission };
}
