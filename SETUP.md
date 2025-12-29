# Quick Setup Guide

Follow these steps to get your Toodledo recurring tasks app running.

## Step 1: Register Your Toodledo App

1. Visit: https://api.toodledo.com/3/account/doc_register.php
2. Fill out the form to register a new application
3. For "Redirect URI", enter: `http://localhost:3000/callback`
4. Submit the form
5. **SAVE THESE VALUES:**
   - Client ID
   - Client Secret

## Step 2: Get Your OAuth Tokens

### 2a. Build Your Authorization URL

Replace `YOUR_CLIENT_ID` with your actual Client ID:

```
https://api.toodledo.com/3/account/authorize.php?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&scope=basic%20tasks&state=random123
```

### 2b. Visit the URL

1. Copy the URL from above (with YOUR_CLIENT_ID replaced)
2. Paste it into your browser and press Enter
3. Log in to your Toodledo account
4. Click "Authorize" to grant permission

### 2c. Copy the Authorization Code

After authorizing, you'll be redirected to a URL that looks like:
```
http://localhost:3000/callback?code=ABC123XYZ789&state=random123
```

Copy the value after `code=` (the part before `&state`). This is your **AUTHORIZATION_CODE**.

### 2d. Exchange Code for Tokens

Run this curl command in your terminal. Replace:
- `YOUR_CLIENT_ID` with your Client ID
- `YOUR_CLIENT_SECRET` with your Client Secret
- `AUTHORIZATION_CODE` with the code from step 2c

```bash
curl -X POST https://api.toodledo.com/3/account/token.php \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri=http://localhost:3000/callback"
```

You'll get a response like:
```json
{
  "access_token": "abc123...",
  "refresh_token": "xyz789...",
  "expires_in": 7200,
  "token_type": "Bearer",
  "scope": "basic tasks"
}
```

**SAVE THESE VALUES:**
- access_token
- refresh_token

## Step 3: Set Up Environment Variables

### For Vercel Deployment:

Go to your Vercel project settings and add these environment variables:

```
TOODLEDO_CLIENT_ID=your_client_id_here
TOODLEDO_CLIENT_SECRET=your_client_secret_here
TOODLEDO_ACCESS_TOKEN=your_access_token_here
TOODLEDO_REFRESH_TOKEN=your_refresh_token_here
```

Optional (for cron security):
```
CRON_SECRET=any_random_string_here
```

### For Local Development:

Create a `.env.local` file in the project root:

```
TOODLEDO_CLIENT_ID=your_client_id_here
TOODLEDO_CLIENT_SECRET=your_client_secret_here
TOODLEDO_ACCESS_TOKEN=your_access_token_here
TOODLEDO_REFRESH_TOKEN=your_refresh_token_here
CRON_SECRET=optional_random_string
```

## Step 4: Configure Your Tasks

1. Visit your deployed app (or http://localhost:3000 for local dev)
2. Click "Load Example Config" to see the format
3. Edit the config to add your tasks
4. Click "Save Config"

## Step 5: Test It

Click "Trigger Tasks Now" to test creating tasks immediately. Check your Toodledo account to verify the tasks were created!

## Task Config Format

```json
{
  "tasks": [
    {
      "title": "Your task title",
      "priority": 2,
      "context": "Work",
      "recurrence": "daily"
    }
  ]
}
```

**Field Reference:**
- `priority`: 0=negative, 1=low, 2=medium, 3=high, 4=top
- `recurrence`: "daily" or "weekly"
- `dayOfWeek`: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday (only needed for weekly tasks)

## Troubleshooting

**"Token refresh failed"**: Your tokens may have expired. Re-run the OAuth flow from Step 2 to get new tokens.

**"Unauthorized"**: Check that your Client ID and Secret are correct.

**Tasks not appearing**: Check the Result panel in the dashboard after clicking "Trigger Tasks Now" for error messages.
