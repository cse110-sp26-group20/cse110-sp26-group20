import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Readable } from 'stream';

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
    expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello');
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

  test('constructor throws error for empty storage directory', () => {
    expect(() => new LocalStorageStrategy('')).toThrow(
      'Storage directory cannot be empty.'
    );
  });

  test('resolvePath() throws error for empty filename', async () => {
    await expect(storage.resolvePath('')).rejects.toThrow(
      'Filename cannot be empty.'
    );
  });

  test('resolvePath() throws error for null filename', async () => {
    await expect(
      storage.resolvePath(null as unknown as string)
    ).rejects.toThrow('Filename cannot be empty.');
  });
  test('read() returns a stream with correct content', async () => {
    const content = 'hello world';
    await storage.write('real.txt', Buffer.from(content));

    const stream = (await storage.read('real.txt')) as Readable;
    expect(stream).toBeDefined();

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const resultString = Buffer.concat(chunks).toString('utf-8');
    expect(resultString).toBe(content);
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
