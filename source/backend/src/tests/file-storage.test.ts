import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  LocalStorageStrategy,
  NoStorageStrategy
} from '../models/file-storage';

describe('LocalStorageStrategy', () => {
  let storageDir: string;
  let storage: LocalStorageStrategy;

  beforeEach(() => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-test-'));
    storage = new LocalStorageStrategy(storageDir);
  });

  afterEach(() => {
    fs.rmSync(storageDir, { recursive: true, force: true });
  });

  test('write() saves a file', async () => {
    const filePath = await storage.write('test.txt', Buffer.from('hello'));
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('read() returns a stream', async () => {
    const stream = await storage.read('missing.txt');
    expect(stream).toBeDefined();
    expect(typeof stream.pipe).toBe('function');
  });

  test('resolvePath() returns full path', async () => {
    const filePath = await storage.resolvePath('test.txt');

    expect(filePath).toBe(path.join(storageDir, 'test.txt'));
  });

  test('remove() deletes a file', async () => {
    await storage.write('test.txt', Buffer.from('hello'));
    const removed = await storage.remove('test.txt');
    expect(removed).toBe(true);
  });

  test('remove() returns false for missing file', async () => {
    const removed = await storage.remove('missing.txt');
    expect(removed).toBe(false);
  });
});

describe('NoStorageStrategy', () => {
  test('write() returns empty string', async () => {
    const storage = new NoStorageStrategy();
    expect(await storage.write()).toBe('');
  });

  test('remove() returns false', async () => {
    const storage = new NoStorageStrategy();
    expect(await storage.remove()).toBe(false);
  });

  test('resolvePath() returns empty string', async () => {
    const storage = new NoStorageStrategy();
    expect(await storage.resolvePath()).toBe('');
  });
});
