# 30 October, Beddoe Avenue

A Halloween pre-drinks invitation for Friday 30 October, 6:00 until 10:00, at 3/41 Beddoe Avenue, Clayton. Costume required. Bring drinks and snacks. Afterwards, Halloween Havoc at Ms Collins.

The night sky uses the Spider Particles effect from [Hyperiux Vault](https://21st.dev/@hyperiux/library/hyperiux-vault) on 21st. The RSVP control is the Shiny Button from the same library. It opens a WhatsApp group.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123) if you start the dev server with `-p 43123`. The default Next.js port is 3000.

## WhatsApp group

Paste the group invite in either place:

- `WHATSAPP_GROUP_URL` in `src/lib/party.ts`
- `NEXT_PUBLIC_WHATSAPP_GROUP_URL` in `.env.local` (see `.env.example`)

The invite looks like `https://chat.whatsapp.com/…`. Until one of those is set, RSVP opens WhatsApp with a message ready to send into the group.
