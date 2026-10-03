# Halloween at Beddoe

A one-page website for Halloween pre-drinks on Friday 30 October 2026, from 6pm at 3/41 Beddoe Avenue, Clayton. Costume required, BYO drinks and snacks. Afterwards everyone heads to Halloween Havoc at Ms Collins.

The look takes its cues from the Halloween Havoc poster: a glowing halftone jack-o'-lantern, cream flared serif type (Cinzel), a yellow marker accent (Permanent Marker) and wide Archivo for the details.

The page has:

- a hero with a live countdown to 6pm Melbourne time
- the plan for the night
- what to bring, with a link to Havoc tickets on Eventbrite
- a map of the house and directions to Ms Collins
- an RSVP button that opens WhatsApp

The cursor spider web in the hero is Spider Particles, and the RSVP control is Shiny Button. Both come from [Hyperiux Vault](https://21st.dev/@hyperiux/library/hyperiux-vault) on 21st.

## Run it

```bash
npm install
npm run dev -- --port 43123
```

Then open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## WhatsApp group

Paste the group invite in either place:

- `WHATSAPP_GROUP_URL` in `src/lib/party.ts`
- `NEXT_PUBLIC_WHATSAPP_GROUP_URL` in `.env.local` (see `.env.example`)

The invite looks like `https://chat.whatsapp.com/…`. Until one of those is set, RSVP opens WhatsApp with a message ready to send into the group.
