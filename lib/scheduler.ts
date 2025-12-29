import { RecurringTask } from '@/types';
import { ToodledoClient, getTokenData, initializeTokens } from './toodledo';
import { getConfig } from './config';

export async function getTasksToCreate(): Promise<RecurringTask[]> {
  const config = await getConfig();
  const now = new Date();
  const dayOfWeek = now.getDay();

  return config.tasks.filter((task) => {
    if (task.recurrence === 'daily') {
      return true;
    }
    if (task.recurrence === 'weekly' && task.dayOfWeek === dayOfWeek) {
      return true;
    }
    return false;
  });
}

export async function createScheduledTasks() {
  const tasks = await getTasksToCreate();

  if (tasks.length === 0) {
    return { success: true, message: 'No tasks to create', results: [] };
  }

  // Get tokens from file or initialize from env
  let tokenData = await getTokenData();

  if (!tokenData) {
    // Initialize tokens from environment variables
    const accessToken = process.env.TOODLEDO_ACCESS_TOKEN;
    const refreshToken = process.env.TOODLEDO_REFRESH_TOKEN;

    if (!accessToken || !refreshToken) {
      throw new Error('Tokens not found. Set TOODLEDO_ACCESS_TOKEN and TOODLEDO_REFRESH_TOKEN');
    }

    await initializeTokens(accessToken, refreshToken);
    tokenData = await getTokenData();
  }

  if (!tokenData) {
    throw new Error('Failed to initialize tokens');
  }

  const clientId = process.env.TOODLEDO_CLIENT_ID || '';
  const clientSecret = process.env.TOODLEDO_CLIENT_SECRET || '';

  const client = new ToodledoClient(
    tokenData.accessToken,
    tokenData.refreshToken,
    clientId,
    clientSecret,
    tokenData.expiresAt
  );

  const results = await client.createTasks(
    tasks.map((task) => ({
      title: task.title,
      priority: task.priority,
      context: task.context,
    }))
  );

  return {
    success: true,
    message: `Created ${results.filter((r) => r.success).length} of ${tasks.length} tasks`,
    results,
  };
}
