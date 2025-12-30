# Quick Setup Guide

Just 3 easy steps to get your Toodledo recurring tasks app running!

## Step 1: Register Your Toodledo App

1. Visit: https://api.toodledo.com/3/account/doc_register.php
2. Fill out the form to register a new application
3. For "Redirect URI", enter:
   - **Production**: `https://your-app-name.vercel.app/oauth/callback`
   - **Local dev**: `http://localhost:3000/oauth/callback`
4. Submit the form
5. **SAVE THESE VALUES:**
   - Client ID
   - Client Secret

## Step 2: Set Up Environment Variables

### For Vercel:

1. Deploy your app to Vercel (push to GitHub and import)
2. Go to your Vercel project settings → Environment Variables
3. Add these:
   ```
   TOODLEDO_CLIENT_ID=your_client_id_here
   TOODLEDO_CLIENT_SECRET=your_client_secret_here
   CRON_SECRET=any_random_string (optional)
   ```

### For Local Development:

Create a `.env.local` file in the project root:

```
TOODLEDO_CLIENT_ID=your_client_id_here
TOODLEDO_CLIENT_SECRET=your_client_secret_here
CRON_SECRET=optional_random_string
```

## Step 3: Connect to Toodledo (One Click!)

1. Visit your deployed app (or `http://localhost:3000` for local dev)
2. Click the **"Connect to Toodledo"** button at the top
3. When prompted, enter your **Client ID** from Step 1
4. You'll be redirected to Toodledo - log in and click **"Authorize"**
5. You'll be redirected back to your app - **done!**

The app automatically saves and refreshes your tokens every 2 hours.

## Step 4: Configure Your Tasks

1. Click "Load Example Config" to see the format
2. Edit the JSON to add your tasks
3. Click "Save Config"

## Step 5: Test It!

1. Click "Trigger Tasks Now" to test
2. Check your Toodledo account to verify tasks were created!

---

## Task Config Format

```json
{
  "tasks": [
    {
      "title": "Your task title",
      "priority": 2,
      "context": "Work",
      "recurrence": "daily"
    },
    {
      "title": "Weekly task",
      "priority": 3,
      "context": "Personal",
      "recurrence": "weekly",
      "dayOfWeek": 1
    }
  ]
}
```

**Field Reference:**
- `priority`: 0=negative, 1=low, 2=medium, 3=high, 4=top
- `recurrence`: "daily" or "weekly"
- `dayOfWeek`: 0=Sunday, 1=Monday, ..., 6=Saturday (only for weekly tasks)
- `context`: Your Toodledo folder/context name

---

## Troubleshooting

**"Token refresh failed"**: Click "Connect to Toodledo" again to re-authorize.

**"Unauthorized"**: Check that your Client ID and Secret are correct in environment variables.

**Tasks not appearing**: Check the Result panel in the dashboard for error messages.

**Redirect URI mismatch**: Make sure the redirect URI in your Toodledo app settings EXACTLY matches your app URL + `/oauth/callback`.
