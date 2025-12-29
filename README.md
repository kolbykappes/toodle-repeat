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
4. Set redirect URI to `http://localhost:3000/callback` (or any URL - not used for manual flow)

### 2. Get OAuth Tokens Manually

**Build authorization URL** (replace `YOUR_CLIENT_ID` and `YOUR_REDIRECT_URI`):
```
https://api.toodledo.com/3/account/authorize.php?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=basic%20tasks&state=random123
```

Visit the URL in your browser, log in, and authorize. You'll be redirected to a URL like:
```
http://localhost:3000/callback?code=AUTHORIZATION_CODE&state=random123
```

Copy the `AUTHORIZATION_CODE` from the URL.

**Exchange code for tokens** (replace placeholders):
```bash
curl -X POST https://api.toodledo.com/3/account/token.php \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri=YOUR_REDIRECT_URI"
```

You'll receive:
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 7200
}
```

Save both tokens! Access tokens expire after 2 hours but are auto-refreshed. Refresh tokens expire after 30 days of inactivity.

### 3. Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `TOODLEDO_CLIENT_ID`: Your client ID
   - `TOODLEDO_CLIENT_SECRET`: Your client secret
   - `TOODLEDO_ACCESS_TOKEN`: Initial access token from step 2
   - `TOODLEDO_REFRESH_TOKEN`: Refresh token from step 2
   - `CRON_SECRET`: (Optional) A random string for cron endpoint security

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
TOODLEDO_ACCESS_TOKEN=your_initial_access_token
TOODLEDO_REFRESH_TOKEN=your_refresh_token
CRON_SECRET=optional_secret
```

The app automatically refreshes access tokens before they expire (every 2 hours).

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration
- `POST /api/trigger` - Manually trigger task creation
- `GET /api/cron` - Cron endpoint (called automatically by Vercel)
