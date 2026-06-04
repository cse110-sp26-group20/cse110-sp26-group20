import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import type { Stream } from 'stream';

import { StorageStrategy } from './file-storage';

/**
 * persists uploaded files to the local filesystem under a configurable
 * directory. the directory is created on construction if it does not exist.
 */
export class LocalStorageStrategy extends StorageStrategy {
  private uploadDir: string;

  constructor(uploadDir: string) {
    super();
    this.uploadDir = uploadDir;
    mkdirSync(uploadDir, { recursive: true });
  }

  /**
   * writes `fileStream` to `<uploadDir>/<filename>`. supports both in-memory
   * `Buffer`s (from multer's memory storage) and readable streams.
   * resolves with the absolute path of the written file.
   */
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

  /** not yet implemented; always returns false */
  async remove(): Promise<boolean> {
    return false;
  }

  /**
   * returns the public URL path for a stored file, e.g. `/uploads/abc123.jpg`.
   * this matches the static-file mount in `app.ts`.
   */
  async resolvePath(filename: string): Promise<string> {
    return `/uploads/${filename}`;
  }
}
