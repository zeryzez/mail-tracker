# Mail Tracker — Server

Backend API server that tracks email opens via pixel requests and provides a dashboard to view tracking statistics.

## Files
- [server/api/track.js](server/api/track.js) — pixel tracking endpoint
- [server/api/stats.js](server/api/stats.js) — stats API (paginated, requires auth)
- [server/api/delete.js](server/api/delete.js) — delete tracking record
- [server/lib/db.js](server/lib/db.js) — Supabase client
- [server/lib/db.sql](server/lib/db.sql) — database schema
- [server/public/](server/public/) — dashboard UI (HTML, CSS, JS)
- [server/.env.EXAMPLE](server/.env.EXAMPLE) — environment template

## Description
The server:
- Exposes `/api/track?id=<UUID>` to handle pixel requests from opened emails.
- Logs the IP, user-agent, and timestamp when a pixel is requested.
- Filters out bot traffic automatically.
- Provides `/api/stats` endpoint to fetch paginated tracking data (requires admin password).
- Serves a web dashboard to view and delete tracking records.

## Requirements
- A Supabase project
- The `email_logs` table created (see schema below)

## Database Schema
Create the `email_logs` table in Supabase using the SQL in [server/lib/db.sql](server/lib/db.sql):

```sql
create table email_logs (
  id text primary key,
  recipient_email text,
  status text default 'sent',
  sent_at timestamptz,
  opened_at timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz default now()
);
```

## Environment variables
Create a `.env` in the `server` folder (or copy `.env.EXAMPLE`) with:
- SUPABASE_URL — your Supabase URL
- SUPABASE_KEY — service role key (with write permissions)
- ADMIN_SECRET — admin password for the dashboard (any string you choose)

Example (.env):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key
ADMIN_SECRET=your_secret_password_here
```

## Install
```bash
cd /home/zeryzez/Bureau/Project/mail-tracker/server
npm install
```

## API Endpoints

### GET `/api/track?id=<UUID>`
Handles pixel requests. Records the open event with IP and user-agent.
- **Response:** 1x1 transparent GIF image
- **Bot filter:** Automatically ignores requests from known bots (Googlebot, Bingbot, etc.)

### GET `/api/stats?secret=<ADMIN_SECRET>&page=1&limit=10`
Fetches paginated tracking statistics.
- **Requires:** `secret` query parameter matching `ADMIN_SECRET`
- **Returns:** JSON with `data` (array of logs) and `total` (count)
- **Status:** 401 if secret is incorrect

### DELETE `/api/delete?secret=<ADMIN_SECRET>&id=<ID>`
Deletes a tracking record.
- **Requires:** `secret` query parameter and tracking `id`
- **Status:** 401 if secret is incorrect, 200 on success

## Dashboard
Open the dashboard in your browser (served on the same host):
- URL: `https://your-server/` (or `http://localhost:PORT/`)
- **Initial access:** You'll be prompted for the admin password (the `ADMIN_SECRET` value)
- **Features:**
  - View all tracked emails with pagination
  - See open status, send time, and open time
  - Delete individual tracking records
  - Refresh data with the refresh button

### Dashboard Files
- [server/public/index.html](server/public/index.html) — main dashboard page
- [server/public/style.css](server/public/style.css) — styling
- [server/public/script.js](server/public/script.js) — dashboard logic

## Deployment
1. Deploy the server to a hosting platform (Vercel, Railway, Render, etc.)
2. Set environment variables in your hosting dashboard
3. Ensure `PIXEL_URL` on the client points to your deployed server
4. Test by sending an email from the client and opening it

## Tracking Logic
1. Client sends email with pixel: `<img src="https://your-server/api/track?id=abc123" />`
2. When recipient opens the email, the pixel URL is requested
3. Server receives the request, extracts the `id`, checks for bots
4. Server updates the `email_logs` table with `opened_at`, `ip`, `user_agent`
5. Dashboard queries `/api/stats` to display all tracking records

## Privacy & Ethics
- Use this tool only for legitimate testing and analytics with user consent
- Do not use tracking pixels to violate privacy laws (GDPR, CCPA, etc.)
- Always provide opt-out mechanisms for recipients

## License
MIT