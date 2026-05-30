import fs from 'fs';
import path from 'path';
import { Readable, type Stream } from 'stream';

export abstract class StorageStrategy {
  /**
   *
   * @param filename name
   * @param fileStream stream
   * @return path/filename.ext
   */
  abstract write(
    filename: string,
    fileStream: Buffer | Stream,
  ): Promise<string>;

  abstract read(filename: string): Promise<Stream>;
  abstract remove(filename: string): Promise<boolean>;
  abstract resolvePath(filename: string): Promise<string>;
}

/**
 * LocalStorageStrategy stores files on the local file system.
 * It writes, reads, removes, and resolves files inside a local storage directory.
 */
export class LocalStorageStrategy extends StorageStrategy {
  constructor(private storageDir: string) {
    super();

    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
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
      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);

        fileStream.pipe(writeStream);

        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    }

    return filePath;
  }

  /**
   * Reads a file from the local storage directory.
   */
  async read(filename: string): Promise<Stream> {
    const filePath = await this.resolvePath(filename);

    if (!fs.existsSync(filePath)) {
      return Readable.from([]);
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
   */
  async resolvePath(filename: string): Promise<string> {
    return path.join(this.storageDir, filename);
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