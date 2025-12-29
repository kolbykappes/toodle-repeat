import { NextResponse } from 'next/server';
import { createScheduledTasks } from '@/lib/scheduler';

export async function POST() {
  try {
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
    console.error('Trigger error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
