import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import type { Stream } from 'stream';

import { StorageStrategy } from './file-storage';

export class LocalStorageStrategy extends StorageStrategy {
  private uploadDir: string;

  constructor(uploadDir: string) {
    super();
    this.uploadDir = uploadDir;
    mkdirSync(uploadDir, { recursive: true });
  }

  async write(filename: string, fileStream: Buffer | Stream): Promise<string> {
    const filePath = join(this.uploadDir, filename);
    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      if (Buffer.isBuffer(fileStream)) {
        writeStream.write(fileStream, (err) => {
          if (err) reject(err);
        });
        writeStream.end();
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      } else {
        (fileStream as Stream).pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      }
    });
    return filePath;
  }

  async read(filename: string): Promise<Stream> {
    return createReadStream(join(this.uploadDir, filename));
  }

  async remove(): Promise<boolean> {
    return false;
  }

  async resolvePath(filename: string): Promise<string> {
    return `/uploads/${filename}`;
  }
}
