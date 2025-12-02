# 🕵️‍♂️ Serverless Email Pixel Tracker

A lightweight, robust, and cost-effective email tracking solution built with **Node.js**, **Vercel Serverless Functions**, and **Supabase**.

This project allows you to track when emails are opened using an invisible 1x1 pixel. It distinguishes between "Sent" and "Opened" statuses, filters out common bots, and provides a secure dashboard to view analytics.

## ✨ Features

* **Invisible Tracking:** Serves a transparent 1x1 GIF to track opens.
* **Lifecycle Tracking:** Distinguishes between emails "Sent" (via script) and "Opened".
* **Bot Filtering:** Intelligent User-Agent filtering to ignore scanners, crawlers, and antivirus bots (prevents false positives).
* **Smart Updates:** Handles both manual tests (Insert) and scripted campaigns (Update).
* **Admin Dashboard:**
  * View recipient email, status, date sent, and date opened.
  * Detects device type (Mobile/Desktop).
  * **Pagination** (10 items per page).
  * **Deletion** capability to clean up history.
* **Secure:** Dashboard is protected by a simple Admin Secret.

## 🛠 Tech Stack

* **Backend:** Node.js (Vercel Serverless Functions)
* **Database:** Supabase (PostgreSQL)
* **Frontend:** Vanilla HTML / CSS / JavaScript (No framework required)
* **Hosting:** Vercel (Free Tier friendly)

## 📁 Project Structure

```
mail-tracker/
├── client/          # Email sending client
│   ├── sender.js    # Script to send tracked emails
│   ├── package.json
│   └── .env.example
│
├── server/          # Tracking API & Dashboard
│   ├── api/
│   │   ├── track.js   # Pixel tracking endpoint
│   │   ├── stats.js   # Stats API
│   │   └── delete.js  # Delete records
│   ├── lib/
│   │   ├── db.js      # Supabase client
│   │   └── db.sql     # Database schema
│   ├── public/        # Dashboard UI
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── package.json
│   └── .env.EXAMPLE
│
└── README.md        # This file
```

## 🚀 Getting Started

### 1. Prerequisites

* A [Supabase](https://supabase.com) account.
* Node.js 18+ installed locally.

### 2. Database Setup (Supabase)

Go to your Supabase SQL Editor and run the following command to create the necessary table:

```sql
CREATE TABLE email_logs (
  id text PRIMARY KEY,            -- UUID or Custom ID
  recipient_email text,           -- Email address (optional)
  status text DEFAULT 'sent',     -- 'sent' or 'opened'
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
```

### 3. Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**`server/.env`:**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_key
ADMIN_SECRET=my_super_secret_password
```

**`client/.env`:**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
PIXEL_URL=https://your-server/
```

### 4. Installation & Local Development

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

```

## 📡 API Reference

### 1. The Tracking Pixel

**GET** `/api/track?id=YOUR_ID`

Embed this in your emails.

* **Response:** Returns a 1x1 transparent GIF.
* **Behavior:** Updates the database status to `opened` and records the timestamp. Ignores Bots.

### 2. Get Statistics

**GET** `/api/stats?secret=PASSWORD&page=1&limit=10`

* **Headers/Query:** Requires `secret` matching `ADMIN_SECRET`.
* **Response:** JSON object containing email logs and pagination info.

### 3. Delete Record

**DELETE** `/api/delete?secret=PASSWORD&id=YOUR_ID`

* **Response:** Deletes the specified log from the database.

## 📧 How to Send a Tracked Email

You can generate the tracking link manually or use the included client script.

### Option A: Manual / No-Code

Simply add this HTML to any email you send:

```html
<img src="https://your-project.vercel.app/api/track?id=test_manual_1" width="1" height="1" />
```

*Note: The recipient email will show as "Unknown" in the dashboard, but you will see the open time.*

### Option B: Automated Script (Node.js)

Use the client script to track the **"Sent"** status and the **Recipient Email**.

See [client/README.md](client/README.md) for full setup instructions.

```bash
cd client
npm start
```

## 📚 Detailed Documentation

* **[Server Documentation](server/README.md)** — API endpoints, deployment, and troubleshooting
* **[Client Documentation](client/README.md)** — Email sending setup and configuration

## ☁️ Deployment

Deploying to Vercel is instant.

1. Push your code to GitHub.
2. Import the **`server`** folder in Vercel.
3. Add your **Environment Variables** (`SUPABASE_URL`, `SUPABASE_KEY`, `ADMIN_SECRET`) in the Vercel Project Settings.
4. Deploy!

Then update `PIXEL_URL` in the client `.env` to point to your deployed server.

## 🛡️ Privacy & GDPR Note

This tool collects IP addresses and User Agents. If you are operating in the EU/UK:

1. You must inform users that you use tracking pixels in your Privacy Policy.
2. This tool is intended for transactional emails or legitimate interest marketing.
3. Always provide an opt-out mechanism for recipients.

## 📄 License

MIT