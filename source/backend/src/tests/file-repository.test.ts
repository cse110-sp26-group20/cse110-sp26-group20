import { Readable } from 'stream';

import { UnsupportedMimeTypeError } from '../errors/unsupported-mime-type.error';
import { NoStorageStrategy, StorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import { CounterGenerator } from '../models/id-generator';
import { FileRepository } from '../services/file-repository';
import { streamToBuffer } from './utils';

describe('FileRepository', () => {
  let strategy: StorageStrategy;
  let fileRepository: FileRepositoryOperator;
  let counterGenerator: CounterGenerator;

  beforeEach(() => {
    counterGenerator = new CounterGenerator();
    strategy = new NoStorageStrategy();
    fileRepository = new FileRepository(counterGenerator);
  });

  test('NoStorageStrategy should do nothing, empty string and empty stream', async () => {
    const filename = 'no_name';
    const inputStream = Readable.from([]);
    const path = await strategy.write(filename, inputStream);
    expect(path).toBe('');

    const stream = (await strategy.read(filename)) as Readable;
    const buffer = await streamToBuffer(stream);
    expect(buffer.length).toBe(0);
  });

  test('CounterGenerator should produce increment int from 1', () => {
    const id1 = counterGenerator.generate();
    expect(id1).toEqual('1');
    for (let index = 0; index < 9; index++) {
      counterGenerator.generate();
    }
    const id2 = counterGenerator.generate();
    expect(id2).toEqual('11');
  });

  test('CounterGenerator reset() should restart the sequence from 1', () => {
    counterGenerator.generate();
    counterGenerator.generate();
    counterGenerator.reset();
    const id = counterGenerator.generate();
    expect(id).toEqual('1');
  });

  test('FileRepository should save a file and return FileRecord with correct ID and metadata', () => {
    const buffer = Buffer.alloc(5);
    buffer.write('test\0');
    const record: Partial<FileRecord> = {};
    record.metadata = { width: 100, height: 500 };
    record.type = 'image/png';
    const result = fileRepository.saveFile(buffer, record, strategy);
    expect(result.id).toEqual('1');
    expect(result.metadata['width']).toBe(100);
    expect(result.metadata['height']).toBe(500);
    expect(result.filename).toBe('1.png');
  });

  test('FileRepository should get a correct FileRecord by ID', async () => {
    // start from '2' to simulate ID '1' already being taken elsewhere
    counterGenerator.startFrom(2);

    // insert 100 elements into the file repository
    for (let index = 0; index < 100; index++) {
      const record: Partial<FileRecord> = {};
      record.type = 'image/png';
      fileRepository.saveFile(Readable.from([]), record, strategy);
    }

    // ID '1' was skipped, so it should not be in the repository
    const result1 = fileRepository.getFileById('1');
    expect(result1).toBeUndefined();

    // IDs 2–101 should all be present
    for (let index = 2; index < 102; index++) {
      const element = fileRepository.getFileById(index.toString());
      expect(element).toBeDefined();
      expect(element?.id).toBe(index.toString());

      const stream = fileRepository.getFileStream(
        index.toString(),
        strategy
      ) as Readable;
      const buffer = await streamToBuffer(stream);
      expect(buffer.length).toBe(0);
    }

    // ID '103' was never allocated
    const result2 = fileRepository.getFileById('103');
    expect(result2).toBeUndefined();
  });

  test('FileRepository should throw an error if metadata is missing or type is empty', () => {
    const buffer = Buffer.from('dummy data');
    const emptyRecord: Partial<FileRecord> = {}; // missing 'type'

    expect(() => {
      fileRepository.saveFile(buffer, emptyRecord, strategy);
    }).toThrow(TypeError);
  });

  test('FileRepository should throw UnsupportedMimeTypeError for invalid MIME types', () => {
    const buffer = Buffer.from('dummy data');
    const invalidRecord: Partial<FileRecord> = { type: 'application/pdf' };

    expect(() => {
      fileRepository.saveFile(buffer, invalidRecord, strategy);
    }).toThrow(UnsupportedMimeTypeError);
  });
});
