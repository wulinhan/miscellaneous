// Singapore public holidays, used to exclude non-business days from the
// delivery lead-time calculation.
//
// IMPORTANT: These 2026 dates are a starting point and MUST be confirmed
// against the official MOM gazette (Islamic and Hindu holiday dates shift
// year to year). In production this list should live in the CMS (Sanity)
// and be editable by the owner, then passed into the schedule functions.

export const SG_PUBLIC_HOLIDAYS_2026: string[] = [
  '2026-01-01', // New Year's Day
  '2026-02-17', // Chinese New Year
  '2026-02-18', // Chinese New Year
  '2026-03-20', // Hari Raya Puasa (confirm)
  '2026-04-03', // Good Friday
  '2026-05-01', // Labour Day
  '2026-05-27', // Hari Raya Haji (confirm)
  '2026-06-01', // Vesak Day observed (confirm)
  '2026-08-10', // National Day observed (9 Aug falls on Sunday)
  '2026-11-09', // Deepavali observed (confirm)
  '2026-12-25', // Christmas Day
];

export function defaultHolidaySet(): Set<string> {
  return new Set(SG_PUBLIC_HOLIDAYS_2026);
}
