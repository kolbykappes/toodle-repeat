import { NextRequest, NextResponse } from 'next/server';
import { initializeTokens } from '@/lib/toodledo';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    const clientId = process.env.TOODLEDO_CLIENT_ID;
    const clientSecret = process.env.TOODLEDO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'TOODLEDO_CLIENT_ID and TOODLEDO_CLIENT_SECRET must be set in environment variables' },
        { status: 500 }
      );
    }

    // Get the redirect URI from environment or construct it
    const redirectUri = process.env.TOODLEDO_REDIRECT_URI || `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/oauth/callback`;

    // Exchange authorization code for tokens
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api.toodledo.com/3/account/token.php', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Token exchange failed: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { error: 'Invalid token response from Toodledo' },
        { status: 500 }
      );
    }

    // Save tokens to file
    await initializeTokens(data.access_token, data.refresh_token);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Toodledo',
    });
  } catch (error) {
    console.error('OAuth exchange error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
