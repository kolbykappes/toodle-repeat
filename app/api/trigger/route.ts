import { NextResponse } from 'next/server';
import { createScheduledTasks } from '@/lib/scheduler';

export async function POST() {
  try {
    const result = await createScheduledTasks();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Trigger error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
