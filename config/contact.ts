/**
 * Public contact configuration.
 *
 * Privacy rule: this file may only ever contain public business contact
 * details that Allison has explicitly approved for publication. It must
 * never contain a personal street address or personal phone number — the
 * legacy site's 2014-era "About" record listed only a city (New York City)
 * as Allison's residence, and even that should not be republished as a
 * current, precise location. Keep this to a routable inbox only until
 * Allison confirms otherwise.
 */
export const contactConfig = {
  editorial: {
    label: "Editorial",
    email: process.env.NEXT_PUBLIC_EDITORIAL_EMAIL ?? "editorial@workingwomanreport.com",
    note: "Story tips, corrections, and editorial inquiries.",
  },
  booking: {
    label: "Booking",
    email: process.env.NEXT_PUBLIC_BOOKING_EMAIL ?? "editorial@workingwomanreport.com",
    note: "Interview and guest booking requests. Routed to the shared inbox until a dedicated address is confirmed.",
  },
  corrections: {
    label: "Corrections",
    email: process.env.NEXT_PUBLIC_CORRECTIONS_EMAIL ?? "editorial@workingwomanreport.com",
    note: "Report a factual error for review.",
  },
  // Intentionally omitted until Allison approves publishing them:
  // physical mailing address, personal phone number.
  address: null as string | null,
  phone: null as string | null,
} as const;
