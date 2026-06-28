// Vaara Pooja — the deity traditionally worshipped on each day of the week.
// "Vaara" = day of the week. Generic feature name: "Vaara Pooja".
// `deity` values match the Ishta Daiva catalog where possible, so a Vaara
// Pooja can reuse the same image/mantra audio from the `deities` table.

export type WeekdayDeity = {
  day: number; // JS getDay(): 0 = Sunday … 6 = Saturday
  dayName: string;
  deity: string;
  note?: string;
};

export const WEEKDAY_DEITIES: WeekdayDeity[] = [
  { day: 0, dayName: 'Sunday', deity: 'Aditya' }, // Surya / Sun god
  { day: 1, dayName: 'Monday', deity: 'Shiva', note: 'Somavara — traditional; confirm/change' },
  { day: 2, dayName: 'Tuesday', deity: 'Hanuman' },
  { day: 3, dayName: 'Wednesday', deity: 'Ganesha' },
  { day: 4, dayName: 'Thursday', deity: 'Sai Baba' },
  { day: 5, dayName: 'Friday', deity: 'Lakshmi' },
  { day: 6, dayName: 'Saturday', deity: 'Venkateswara' },
];

/** The Vaara deity for a given date (defaults to today). */
export function todaysDeity(date: Date = new Date()): WeekdayDeity {
  return WEEKDAY_DEITIES[date.getDay()];
}
