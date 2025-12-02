# Mail Tracker — Client 

Small Node.js client that sends test emails containing a 1x1 tracking pixel. The client inserts a log row in Supabase when sending; when the pixel is requested the server updates that row.

## Files
- [client/sender.js](client/sender.js) — main sending script
- [client/.env.example](client/.env.example) — example env file

## Description
The client:
- Generates a UUID for each email (tracking id).
- Sends an email with an embedded image/pixel pointing to the server tracking endpoint (e.g. `https://your-server/api/track?id=<UUID>`).
- Inserts an initial record into the `email_logs` table with `status: 'sent'` and `sent_at`.
- The server updates `opened_at`, `ip`, `user_agent` and `status: 'opened'` when the pixel is requested.

See server tracker implementation: [server/api/track.js](server/api/track.js).

## Requirements
- A Supabase project with a table `email_logs` (schema reference in `server/lib/db.sql`).

## Environment variables
Create a `.env` in the `client` folder (or copy `.env.example`) with:
- SUPABASE_URL — your Supabase URL
- SUPABASE_KEY — service role or anon key with write permissions
- PIXEL_URL — base URL of your server (must include trailing slash if used like in examples)

Example (.env):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
PIXEL_URL=https://your-server/
```

## Install
From the client directory:
```bash
cd /home/zeryzez/Bureau/Project/mail-tracker/client
npm install
```

## Run
Send a test email:
```bash
npm start
# or
node sender.js
```
The script uses Ethereal (test SMTP) and prints a preview URL in the console (`nodemailer.getTestMessageUrl(info)`).

## Notes & troubleshooting
- Some tracking fields may be null:
  - `opened_at`, `ip`, or `user_agent` can be null if the pixel request is blocked by the mail client, removed, or filtered (bots are ignored).
  - The dashboard displays "Pending..." when `opened_at` is null.
- Ensure `PIXEL_URL` points to the deployed server exposing `/api/track`.
- If you see no inserts in Supabase, check the client `.env` values and network connectivity.
- For schema reference: [server/lib/db.sql](server/lib/db.sql).

## Privacy & Ethics
Use this tool only for testing with consent. Do not use tracking pixels to violate privacy or legal rules.

## License
MIT