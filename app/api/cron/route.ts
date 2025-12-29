import { NextRequest, NextResponse } from 'next/server';
import { createScheduledTasks } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = process.env.TOODLEDO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'TOODLEDO_ACCESS_TOKEN not configured' },
        { status: 500 }
      );
    }

    const result = await createScheduledTasks(accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
