# Toodledo Recurring Tasks

A simple app to send recurring tasks to your Toodledo account automatically.

## Features

- Daily and weekly recurring tasks
- Simple JSON configuration
- Web dashboard for config management and testing
- Automatic task creation at 4am daily via Vercel Cron
- Manual trigger for testing

## Setup

### 1. Register Toodledo App

1. Go to https://api.toodledo.com/3/account/doc_register.php
2. Register a new application
3. Save your **Client ID** and **Client Secret**
4. For redirect URI, use your deployed URL + `/oauth/callback` (e.g., `https://your-app.vercel.app/oauth/callback`)
   - For local dev, use `http://localhost:3000/oauth/callback`

### 2. Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `TOODLEDO_CLIENT_ID`: Your client ID from step 1
   - `TOODLEDO_CLIENT_SECRET`: Your client secret from step 1
   - `CRON_SECRET`: (Optional) A random string for cron endpoint security

### 3. Connect Your Toodledo Account

1. Visit your deployed app
2. Click the **"Connect to Toodledo"** button
3. Enter your Client ID when prompted
4. Authorize the app on Toodledo
5. You'll be redirected back - done!

The app will automatically save your tokens and refresh them as needed.

### 4. Configure Tasks

Visit your deployed app's dashboard to configure tasks. The config is a JSON file with this structure:

```json
{
  "tasks": [
    {
      "title": "Daily standup prep",
      "priority": 2,
      "context": "Work",
      "recurrence": "daily"
    },
    {
      "title": "Weekly review",
      "priority": 3,
      "context": "Personal",
      "recurrence": "weekly",
      "dayOfWeek": 1
    }
  ]
}
```

### Task Fields

- `title`: Task title (required)
- `priority`: 0=negative, 1=low, 2=medium, 3=high, 4=top (required)
- `context`: Context/folder name (required)
- `recurrence`: "daily" or "weekly" (required)
- `dayOfWeek`: 0=Sunday, 1=Monday, ..., 6=Saturday (required for weekly tasks)

## Usage

### Dashboard

Access your deployed app to:
- View current configuration
- Edit and save configuration
- Manually trigger task creation for testing

### Automatic Scheduling

Tasks run automatically at 4am UTC daily via Vercel Cron. The cron job checks which tasks should be created based on:
- **Daily tasks**: Created every day
- **Weekly tasks**: Created only on the specified day of week

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to access the dashboard.

Create a `.env.local` file with your credentials:
```
TOODLEDO_CLIENT_ID=your_client_id
TOODLEDO_CLIENT_SECRET=your_client_secret
CRON_SECRET=optional_secret
```

Then click "Connect to Toodledo" in the dashboard to authorize and save your tokens.

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration
- `POST /api/trigger` - Manually trigger task creation
- `GET /api/cron` - Cron endpoint (called automatically by Vercel)
