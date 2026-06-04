import type Stream from 'stream';

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
    public matedata: Record<string, unknown>
  ) {}
}
export interface FileRepositoryOperator {
  saveFile(
    file: Buffer | Stream,
    metadata: Partial<FileRecord>
  ): Promise<FileRecord>;
  getFileById(id: string): FileRecord | undefined;
  getFileStream(id: string): Stream | undefined;
}
