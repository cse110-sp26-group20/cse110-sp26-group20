import type Stream from 'stream';

import type { StorageStrategy } from './file-storage';

/**
 * Represents metadata for a stored file and its location.
 *
 * @param id - Unique identifier for the file.
 * @param filename - The stored filename including extension.
 * @param localPath - Storage-specific path or URI where the file resides.
 * @param type - MIME type for the file (e.g. image/png).
 * @param create - Creation timestamp for the record.
 * @param metadata - Additional arbitrary metadata associated with the file.
 */
export class FileRecord {
  constructor(
    public id: string,
    public filename: string,
    public localPath: string,
    /**
     * MIME Type (image/png, image/jpeg, application/json, and etc.)
     */
    public type: string,
    public create: Date,
    public metadata: Record<string, unknown>
  ) {}
}
export interface FileRepositoryOperator {
  /**
   * Persist a file using the provided storage strategy and return its FileRecord.
   * @param file - The file content as a Buffer or readable Stream.
   * @param metadata - Partial metadata for the file (must include `type`).
   * @param strategy - Strategy responsible for writing the file to storage.
   * @returns A promise that resolves to the created FileRecord for the stored file.
   */
  saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>,
    strategy: StorageStrategy
  ): Promise<FileRecord>;
  /**
   * Retrieve the in-memory FileRecord for a given id.
   * @param id - The identifier of the file record.
   * @returns The FileRecord if present, otherwise `undefined`.
   */
  getFileById(id: string): FileRecord | undefined;
  /**
   * Obtain a readable stream for the file using the provided strategy.
   * @param id - The identifier of the stored file.
   * @param strategy - Storage strategy used to read the underlying file.
   * @returns A promise that resolves to a readable Stream with the file data, or `undefined` if not found.
   */
  getFileStream(
    id: string,
    strategy: StorageStrategy
  ): Promise<Stream | undefined>;
}
