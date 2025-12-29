export interface RecurringTask {
  title: string;
  priority: number; // 0=negative, 1=low, 2=medium, 3=high, 4=top
  context: string;
  recurrence: 'daily' | 'weekly';
  dayOfWeek?: number; // 0=Sunday, 1=Monday, etc. (only for weekly tasks)
}

export interface Config {
  tasks: RecurringTask[];
}

export interface ToodledoCredentials {
  appId: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
}
