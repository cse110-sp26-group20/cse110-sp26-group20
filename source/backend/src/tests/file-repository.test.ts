import { Readable } from 'stream';

import { NoStorageStrategy, StorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import { CounterGenerator, counterGenerator } from '../models/id-generator';
import { FileRepository } from '../services/file-repository';
import { streamToBuffer } from './utils';

describe('Universal AI Provider', () => {
  let strategy: StorageStrategy;
  let fileRepository: FileRepositoryOperator;

  beforeEach(() => {
    strategy = new NoStorageStrategy();
    fileRepository = new FileRepository(counterGenerator);
  });

  it('NoStorageStrategy should do nothing, empty string and empty stream', async () => {
    const filename = 'no_name';
    const inputStrem = Readable.from([]);
    const path = await strategy.write(filename, inputStrem);
    expect(path).toBe('');

    const strem = (await strategy.read(filename)) as Readable;
    const buffer = await streamToBuffer(strem);
    expect(buffer.length).toBe(0);
  });

  it('CounterGenerator should produce increment int from 1', async () => {
    const id1 = counterGenerator.generate();
    expect(id1).toEqual('1');
    for (let index = 0; index < 9; index++) {
      counterGenerator.generate();
    }
    const id2 = counterGenerator.generate();
    expect(id2).toEqual('11');
  });

  it('Ensure the reset() works counterGenerator.reset()', async () => {
    const proxy = new ProxyGeneratorForTesting(counterGenerator);
    proxy.reset();
    const id1 = counterGenerator.generate();
    expect(id1).toEqual('1');
    proxy.reset();
  });

  it('FileRepository should save a file correct and return FileRecord with a correct ID and matedate', async () => {
    new ProxyGeneratorForTesting(counterGenerator).reset();

    const buffer = Buffer.alloc(5);
    buffer.write('test\0');
    const record: Partial<FileRecord> = {};
    record.matedata = { width: 100, height: 500 };
    record.type = 'image/png';
    const result = fileRepository.saveFile(buffer, record, strategy);
    expect(result.id).toEqual('1');
    expect(result.matedata['width']).toBe(100);
    expect(result.matedata['height']).toBe(500);
  });

  it('FileRepository should get a correct FileRecord by ID', async () => {
    // since strategy is static ID '1' is existed.
    for (let index = 0; index < 100; index++) {
      const record: Partial<FileRecord> = {};
      // Async, No waiting.
      await fileRepository.saveFile(Readable.from([]), record, strategy);
    }
  });
});

class ProxyGeneratorForTesting extends CounterGenerator {
  generator: CounterGenerator;
  override generate(): string {
    return this.generator.generate();
  }
  constructor(generator: CounterGenerator) {
    super();
    this.generator = generator;
  }
  reset() {
    this.generator.count = 0;
  }
}
