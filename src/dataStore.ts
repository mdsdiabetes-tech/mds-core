import fs from 'node:fs/promises';
import { CoreData } from './types.js';
const DATA_PATH = new URL('../data/core.json', import.meta.url);
export async function loadCore(): Promise<CoreData> {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw) as CoreData;
}
export async function saveCore(data: CoreData) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}
