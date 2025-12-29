import { promises as fs } from 'fs';
import path from 'path';
import { Config } from '@/types';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

export async function getConfig(): Promise<Config> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty config if file doesn't exist
    return { tasks: [] };
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}
