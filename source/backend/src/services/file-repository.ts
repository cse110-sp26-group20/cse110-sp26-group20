import Stream from 'node:stream';

import type { StorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import type { IDGenerator } from '../models/id-generator';

export class FileRepository implements FileRepositoryOperator {
  inMemoryMap = new Map<string, FileRecord>();
  generator: IDGenerator;
  constructor(generator: IDGenerator) {
    this.generator = generator;
  }
  saveFile(
    file: Buffer | import('node:stream'),
    metadata: Partial<FileRecord>,
    strategy: StorageStrategy
  ): FileRecord {
    const id = this.generator.generate();
    const filename = `{id}.{png}`;
    let path;
    strategy.write(filename, file);
    strategy.write(filename, file).then((value) => {
      path = value;
    });

    metadata.id = id;
    metadata.localPath = path;
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
        let stream;
        strategy.read(record.filename).then((value) => {
          stream = value;
        });
        return stream;
      }
    }
  }
}
