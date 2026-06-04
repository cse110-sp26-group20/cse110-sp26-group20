import fs from 'fs';
import path from 'path';
import { Readable, type Stream } from 'stream';
import { pipeline } from 'stream/promises';

export abstract class StorageStrategy {
  /**
   *
   * @param filename name
   * @param fileStream stream
   * @return path/filename.ext
   */
  abstract write(
    filename: string,
    fileStream: Buffer | Stream
  ): Promise<string>;

  abstract read(filename: string): Promise<Stream>;
  abstract remove(filename: string): Promise<boolean>;
  abstract resolvePath(filename: string): Promise<string>;
}

/**
 * LocalStorageStrategy stores files on the local file system.
 * It writes, reads, removes, and resolves files inside a local storage directory.
 * Throws when the storage directory is empty.
 */
export class LocalStorageStrategy extends StorageStrategy {
  constructor(private storageDir: string) {
    super();

    if (!this.storageDir || this.storageDir.trim() === '') {
      throw new Error('Storage directory cannot be empty.');
    }

    fs.mkdirSync(this.storageDir, { recursive: true });
  }

  /**
   * Writes a file to the local storage directory.
   * If the input is a Buffer, it writes the Buffer directly.
   * If the input is a Stream, it pipes the Stream into a file write stream.
   */
  async write(filename: string, fileStream: Buffer | Stream): Promise<string> {
    const filePath = await this.resolvePath(filename);

    if (Buffer.isBuffer(fileStream)) {
      await fs.promises.writeFile(filePath, fileStream);
    } else {
      const writeStream = fs.createWriteStream(filePath);
      await pipeline(fileStream as NodeJS.ReadableStream, writeStream);
    }

    return filePath;
  }

  /**
   * Reads a file from the local storage directory.
   */
  async read(filename: string): Promise<Stream> {
    const filePath = await this.resolvePath(filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist.');
    }

    return fs.createReadStream(filePath);
  }

  /**
   * Removes a file from the local storage directory.
   */
  async remove(filename: string): Promise<boolean> {
    const filePath = await this.resolvePath(filename);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    await fs.promises.unlink(filePath);

    return true;
  }

  /**
   * Builds the full local path for a filename.
   * This handles null and empty filename
   */
  async resolvePath(filename: string): Promise<string> {
    if (!filename || filename.trim() === '') {
      throw new Error('Filename cannot be empty.');
    }

    const storageRoot = path.resolve(this.storageDir);
    const filePath = path.resolve(storageRoot, filename);

    if (!filePath.startsWith(storageRoot + path.sep)) {
      throw new Error('Filename cannot escape storage directory.');
    }

    return filePath;
  }
}

export class NoStorageStrategy extends StorageStrategy {
  async write(): Promise<string> {
    return '';
  }

  async read(): Promise<Stream> {
    return Readable.from([]);
  }

  async remove(): Promise<boolean> {
    return false;
  }

  async resolvePath(): Promise<string> {
    return '';
  }
}
