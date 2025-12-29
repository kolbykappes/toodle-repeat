import { RecurringTask } from '@/types';
import { ToodledoClient } from './toodledo';
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

export async function createScheduledTasks(accessToken: string) {
  const tasks = await getTasksToCreate();

  if (tasks.length === 0) {
    return { success: true, message: 'No tasks to create', results: [] };
  }

  const client = new ToodledoClient(accessToken);
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
