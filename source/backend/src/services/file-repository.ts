import { PassThrough } from 'stream';
import type Stream from 'stream';

import type { StorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import type { IDGenerator } from '../models/id-generator';
import { getValidImageExtension } from '../utils/mime-type.utils';

/**
 * In-memory file repository that tracks FileRecord entries and
 * delegates actual read/write operations to a provided StorageStrategy.
 */
export class FileRepository implements FileRepositoryOperator {
  inMemoryMap = new Map<string, FileRecord>();
  generator: IDGenerator;
  constructor(generator: IDGenerator) {
    /**
     * Constructs a new FileRepository.
     * @param generator - ID generator used to produce unique file IDs.
     */
    this.generator = generator;
  }
  /**
   * Saves the file and generates a unique record.
   * @description
   * Performance Optimization Note:
   * This method employs a "fire-and-forget" (asynchronous write, early return) strategy.
   * The underlying file storage (`strategy.write`) executes silently in the background,
   * allowing the method to immediately return the generated `FileRecord` to the caller.
   * In very rare cases, if the background storage fails, the frontend will possess a valid ID
   * but subsequent requests for the file will result in a 404. This is an intentional and acceptable design trade-off.
   * @param file - The file stream or Buffer.
   * @param metadata - The file's metadata (must include `type`).
   * @param strategy - The specific storage strategy to apply.
   * @returns Immediately returns the assembled `FileRecord` (even if the underlying file is still transferring).
   */
  saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>,
    strategy: StorageStrategy
  ): Promise<FileRecord> {
    if (!metadata || !metadata.type) {
      throw new TypeError(
        'Metadata is missing or does not contain a valid type.'
      );
    }

    const extension = getValidImageExtension(metadata.type);

    const id = this.generator.generate();
    const filename = `${id}${extension}`;

    const record: FileRecord = {
      id: id,
      filename: filename,
      localPath: '',
      type: metadata.type,
      metadata: metadata.metadata || {},
      create: new Date()
    };

    // fire-and-forget write; update localPath when the strategy returns it
    strategy
      .write(filename, file)
      .then((writtenPath) => {
        record.localPath = writtenPath;
      })
      .catch((err) => {
        console.error(`Failed to write file ${filename}:`, err);
      });

    this.inMemoryMap.set(id, record);

    return Promise.resolve(record);
  }
  /**
   * Retrieves a stored FileRecord by its identifier.
   * @param id - The identifier of the file record to look up.
   * @returns The matching FileRecord, or `undefined` if not found.
   */
  getFileById(id: string): FileRecord | undefined {
    return this.inMemoryMap.get(id);
  }
  /**
   * Returns a readable Stream for the file with the given id.
   * The returned stream is a PassThrough proxy; the storage strategy
   * performs the actual read asynchronously and pipes into the proxy.
   * If the file is not present, `undefined` is returned.
   * @param id - The identifier of the stored file.
   * @param strategy - The storage strategy used to read the file.
   * @returns A readable Stream proxying the file data, or `undefined`.
   */
  getFileStream(
    id: string,
    strategy: StorageStrategy
  ): Promise<Stream | undefined> {
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

        return Promise.resolve(proxyStream);
      }
    }
    return Promise.resolve(undefined);
  }
}
