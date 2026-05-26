import { Readable, type Stream } from 'stream';

export abstract class StorageStrategy {
  /**
   *
   * @param filename name
   * @param fileStream stream
   * @return path/filename.ext
   */
  abstract write(filename: string, fileStream: Buffer | Stream): string;
  abstract read(filename: string): Stream;
  abstract remove(filename: string): boolean;
  abstract resolvePath(filename: string): string;
}

export class NoStorageStrategy implements StorageStrategy {
  write(): string {
    return '';
  }
  read(): Stream {
    return Readable.from([]);
  }
  remove(): boolean {
    return false;
  }
  resolvePath(): string {
    return '';
  }
}
