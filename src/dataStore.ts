import fs from 'node:fs/promises';
import { CoreData } from './types.js';

export const DATA_COLLECTIONS = [
  'products',
  'brands',
  'manufacturers',
  'medications',
  'devices',
  'diseases',
  'categories',
  'faqs',
  'articles',
  'reviews',
  'relationships',
] as const;

type DataCollection = typeof DATA_COLLECTIONS[number];

const DATA_DIR = new URL('../data/', import.meta.url);
const CORE_PATH = new URL('core.json', DATA_DIR);

async function fileExists(path: URL) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(path: URL): Promise<T> {
  const raw = await fs.readFile(path, 'utf8');
  return JSON.parse(raw) as T;
}

function collectionPath(collection: DataCollection) {
  return new URL(`${collection}.json`, DATA_DIR);
}

async function hasSplitData() {
  const existingFiles = await Promise.all(DATA_COLLECTIONS.map(collection => fileExists(collectionPath(collection))));
  return existingFiles.some(Boolean);
}

async function loadSplitCore(): Promise<CoreData> {
  const entries = await Promise.all(
    DATA_COLLECTIONS.map(async collection => [collection, await readJson(collectionPath(collection))] as const)
  );

  return Object.fromEntries(entries) as CoreData;
}

export async function loadCore(): Promise<CoreData> {
  if (await hasSplitData()) return loadSplitCore();

  return readJson<CoreData>(CORE_PATH);
}

export async function saveCore(data: CoreData) {
  await Promise.all(
    DATA_COLLECTIONS.map(collection =>
      fs.writeFile(collectionPath(collection), JSON.stringify(data[collection], null, 2))
    )
  );
  await fs.writeFile(CORE_PATH, JSON.stringify(data, null, 2));
}
