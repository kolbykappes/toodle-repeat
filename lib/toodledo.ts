interface ToodledoTask {
  title: string;
  priority?: number;
  context?: string;
}

export class ToodledoClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createTask(task: ToodledoTask): Promise<any> {
    const params = new URLSearchParams({
      access_token: this.accessToken,
      title: task.title,
    });

    if (task.priority !== undefined) {
      params.append('priority', task.priority.toString());
    }

    if (task.context) {
      params.append('context', task.context);
    }

    const response = await fetch(
      `https://api.toodledo.com/3/tasks/add.php?${params.toString()}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Toodledo API error: ${error}`);
    }

    return response.json();
  }

  async createTasks(tasks: ToodledoTask[]): Promise<any[]> {
    const results = [];
    for (const task of tasks) {
      try {
        const result = await this.createTask(task);
        results.push({ success: true, task: task.title, result });
      } catch (error) {
        results.push({
          success: false,
          task: task.title,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    return results;
  }
}
