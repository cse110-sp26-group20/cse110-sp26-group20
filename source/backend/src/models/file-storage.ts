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
    fileStream: Buffer | Stream
  ): Promise<string>;

  abstract read(filename: string): Promise<Stream>;
  abstract remove(filename: string): Promise<boolean>;
  abstract resolvePath(filename: string): Promise<string>;
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
