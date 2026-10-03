/**
 * Paste the WhatsApp group invite from the group info screen.
 * Example: https://chat.whatsapp.com/AbCdEfGhIjK
 *
 * You can also set NEXT_PUBLIC_WHATSAPP_GROUP_URL in .env.local.
 * When neither is set, RSVP opens WhatsApp with a message ready to send.
 */
export const WHATSAPP_GROUP_URL = "";

/** Melbourne is on AEDT (UTC+11) at the end of October. */
export const startsAt = "2026-10-30T18:00:00+11:00";
export const endsAt = "2026-10-30T22:00:00+11:00";

export const party = {
  address: "3/41 Beddoe Avenue",
  suburb: "Clayton VIC 3168",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=3%2F41+Beddoe+Avenue+Clayton+VIC+3168",
  mapEmbed:
    "https://www.google.com/maps?q=3%2F41+Beddoe+Avenue+Clayton+VIC+3168&z=15&output=embed",
  club: "Ms Collins",
  clubAddress: "425 Collins Street, Melbourne",
  clubMaps:
    "https://www.google.com/maps/search/?api=1&query=Ms+Collins+425+Collins+Street+Melbourne",
  ticketsUrl:
    "https://www.eventbrite.com.au/e/halloween-havoc-tickets-1993663296588",
};

const rsvpMessage =
  "I'm in for Halloween at Beddoe: Friday 30 October, 6pm, 3/41 Beddoe Avenue.";

function groupUrl() {
  return process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || WHATSAPP_GROUP_URL;
}

export function rsvpHref() {
  return groupUrl() || `https://wa.me/?text=${encodeURIComponent(rsvpMessage)}`;
}

export function rsvpHint() {
  return groupUrl()
    ? "Opens the WhatsApp group."
    : "Opens WhatsApp with your RSVP.";
}
