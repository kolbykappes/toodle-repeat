import { promises as fs } from 'fs';
import path from 'path';

interface ToodledoTask {
  title: string;
  priority?: number;
  context?: string;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const TOKEN_PATH = path.join(process.cwd(), '.tokens.json');

export class ToodledoClient {
  private accessToken: string;
  private refreshToken: string;
  private clientId: string;
  private clientSecret: string;
  private expiresAt: number;

  constructor(
    accessToken: string,
    refreshToken: string,
    clientId: string,
    clientSecret: string,
    expiresAt?: number
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.expiresAt = expiresAt || Date.now() + 7200000; // 2 hours default
  }

  private async refreshAccessToken(): Promise<void> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch('https://api.toodledo.com/3/account/token.php', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
    }
    this.expiresAt = Date.now() + (data.expires_in * 1000);

    // Save updated tokens to file
    await this.saveTokens();
  }

  private async saveTokens(): Promise<void> {
    const tokenData: TokenData = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    };
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokenData, null, 2), 'utf-8');
  }

  private async ensureValidToken(): Promise<void> {
    // Refresh if token expires in less than 5 minutes
    if (Date.now() > this.expiresAt - 300000) {
      await this.refreshAccessToken();
    }
  }

  async createTask(task: ToodledoTask): Promise<any> {
    await this.ensureValidToken();

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

export async function getTokenData(): Promise<TokenData | null> {
  try {
    const data = await fs.readFile(TOKEN_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function initializeTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const tokenData: TokenData = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + 7200000, // 2 hours
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokenData, null, 2), 'utf-8');
}
