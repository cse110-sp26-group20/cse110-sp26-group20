import type { Stream } from 'stream';

import type { StorageStrategy } from './file-storage';
import { FileRecord, type FileRepositoryOperator } from './file-system';
import type { IDGenerator } from './id-generator';

/**
 * non-persistent, in-memory implementation of `FileRepositoryOperator`.
 * all records are lost when the process restarts; intended for development
 * and testing only.
 */
export class InMemoryFileRepository implements FileRepositoryOperator {
  private records = new Map<string, FileRecord>();
  private idGenerator: IDGenerator;
  private strategy: StorageStrategy;

  constructor(idGenerator: IDGenerator, strategy: StorageStrategy) {
    this.idGenerator = idGenerator;
    this.strategy = strategy;
  }

  /**
   * generates a unique ID, writes the file bytes via the injected strategy,
   * resolves the public URL, creates a `FileRecord`, and stores it in memory.
   * the `metadata.filename` field should be the original filename; the stored
   * filename is constructed as `<id>.<ext>`.
   */
  async saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>
  ): Promise<FileRecord> {
    const id = this.idGenerator.generate();
    const ext = (metadata.filename ?? '').split('.').pop() ?? '';
    const storedFilename = `${id}.${ext}`;
    await this.strategy.write(storedFilename, file);
    const url = await this.strategy.resolvePath(storedFilename);
    const record = new FileRecord(
      id,
      storedFilename,
      url,
      metadata.type ?? '',
      metadata.create ?? new Date(),
      metadata.matedata ?? {}
    );
    this.records.set(id, record);
    return record;
  }

  getFileById(id: string): FileRecord | undefined {
    return this.records.get(id);
  }

  async getFileStream(id: string): Promise<Stream | undefined> {
    const record = this.records.get(id);
    if (!record) return undefined;
    return this.strategy.read(record.filename);
  }
}
