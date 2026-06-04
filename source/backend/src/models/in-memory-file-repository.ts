import type { Stream } from 'stream';

import type { StorageStrategy } from './file-storage';
import { FileRecord, type FileRepositoryOperator } from './file-system';
import type { IDGenerator } from './id-generator';

export class InMemoryFileRepository implements FileRepositoryOperator {
  private records = new Map<string, FileRecord>();
  private idGenerator: IDGenerator;

  constructor(idGenerator: IDGenerator) {
    this.idGenerator = idGenerator;
  }

  saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>,
    strategy: StorageStrategy
  ): FileRecord {
    const id = metadata.id ?? this.idGenerator.generate();
    const record = new FileRecord(
      id,
      metadata.filename ?? '',
      metadata.localPath ?? '',
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

  getFileStream(id: string, strategy: StorageStrategy): Stream | undefined {
    const record = this.records.get(id);
    if (!record) return undefined;
    let stream: Stream | undefined;
    strategy.read(record.filename).then((s) => {
      stream = s;
    });
    return stream;
  }
}
