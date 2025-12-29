# Toodledo Recurring Tasks

A simple app to send recurring tasks to your Toodledo account automatically.

## Features

- Daily and weekly recurring tasks
- Simple JSON configuration
- Web dashboard for config management and testing
- Automatic task creation at 4am daily via Vercel Cron
- Manual trigger for testing

## Setup

### 1. Get Toodledo Access Token

You'll need a Toodledo API access token. If you have your app credentials (app ID, client ID, client secret), you can get an access token by following the [Toodledo API documentation](https://api.toodledo.com/3/index.php).

### 2. Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `TOODLEDO_ACCESS_TOKEN`: Your Toodledo access token
   - `CRON_SECRET`: (Optional) A random string for cron endpoint security

### 3. Configure Tasks

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
TOODLEDO_ACCESS_TOKEN=your_token
CRON_SECRET=optional_secret
```

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration
- `POST /api/trigger` - Manually trigger task creation
- `GET /api/cron` - Cron endpoint (called automatically by Vercel)
