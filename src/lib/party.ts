/**
 * Paste the WhatsApp group invite from the group info screen.
 * Example: https://chat.whatsapp.com/AbCdEfGhIjK
 *
 * You can also set NEXT_PUBLIC_WHATSAPP_GROUP_URL in .env.local.
 * When neither is set, RSVP opens WhatsApp with a message ready to send.
 */
export const WHATSAPP_GROUP_URL = "";

export const party = {
  day: "30",
  month: "October",
  when: "Friday, from 6:00 until 10:00",
  address: "3/41 Beddoe Avenue, Clayton",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=3%2F41+Beddoe+Avenue+Clayton+VIC+3168",
  bring:
    "Wear a Halloween costume. Bring alcohol or other drinks, and snacks.",
  afterLead: "Afterwards we are going to Halloween Havoc at",
  club: "Ms Collins, 425 Collins Street",
  clubMaps:
    "https://www.google.com/maps/search/?api=1&query=Ms+Collins+425+Collins+Street+Melbourne",
  afterNote: "From 9pm, and you need to be 18 or older.",
};

const rsvpMessage =
  "I'm in for Friday 30 October, 6:00 until 10:00, at 3/41 Beddoe Avenue.";

export function rsvpHref() {
  const group =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || WHATSAPP_GROUP_URL;
  if (group) return group;
  return `https://wa.me/?text=${encodeURIComponent(rsvpMessage)}`;
}

export function rsvpHint() {
  const group =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || WHATSAPP_GROUP_URL;
  return group
    ? "Opens the WhatsApp group."
    : "Opens WhatsApp with your RSVP ready to send.";
}
