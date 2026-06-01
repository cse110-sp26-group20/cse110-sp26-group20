import Stream, { PassThrough } from 'node:stream';

import type { StorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import type { IDGenerator } from '../models/id-generator';
import { getValidImageExtension } from '../utils/mime-type.utils';

/**
 * Saves the file and generates a unique record.
 * * @description
 * Performance Optimization Note:
 * This method employs a "fire-and-forget" (asynchronous write, early return) strategy.
 * The underlying file storage (`strategy.write`) executes silently in the background,
 * allowing the method to immediately return the generated `FileRecord` to the caller.
 * In very rare cases, if the background storage fails, the frontend will possess a valid ID
 * but subsequent requests for the file will result in a 404. This is an intentional and acceptable design trade-off.
 * * @param file - The file stream or Buffer.
 * @param metadata - The file's metadata (must include `type`).
 * @param strategy - The specific storage strategy to apply.
 * @returns Immediately returns the assembled `FileRecord` (even if the underlying file is still transferring).
 */
export class FileRepository implements FileRepositoryOperator {
  inMemoryMap = new Map<string, FileRecord>();
  generator: IDGenerator;
  constructor(generator: IDGenerator) {
    this.generator = generator;
  }
  saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>,
    strategy: StorageStrategy
  ): FileRecord {
    if (!metadata || !metadata.type) {
      throw new TypeError(
        'Metadata is missing or does not contain a valid type.'
      );
    }

    const extension = getValidImageExtension(metadata.type);

    const id = this.generator.generate();
    const filename = `${id}${extension}`;

    // async write
    strategy.write(filename, file).catch((err) => {
      console.error(err);
    });
    strategy.resolvePath(filename).then((value) => {
      metadata.localPath = value;
    });
    metadata.id = id;
    metadata.create = new Date();
    metadata.filename = filename;

    const record = metadata as FileRecord;

    this.inMemoryMap.set(id, record);

    return record;
  }
  getFileById(id: string): FileRecord | undefined {
    return this.inMemoryMap.get(id);
  }
  getFileStream(id: string, strategy: StorageStrategy): Stream | undefined {
    if (this.inMemoryMap.has(id)) {
      const record = this.inMemoryMap.get(id);
      if (record && record.filename) {
        const proxyStream = new PassThrough();
        strategy
          .read(record.filename)
          .then((value) => {
            value.pipe(proxyStream);
          })
          .catch((err) => {
            console.error(`Failed to read file ${record.filename}:`, err);
            proxyStream.destroy(err);
          });

        return proxyStream;
      }
    }
  }
}
