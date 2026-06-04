import type { NextFunction, Request, Response } from 'express';

import type { StorageStrategy } from '../models/file-storage';
import type { FileRepositoryOperator } from '../models/file-system';
import type { IDGenerator } from '../models/id-generator';

export class ImageController {
  fileRepo: FileRepositoryOperator;
  strategy: StorageStrategy;
  idGenerator: IDGenerator;

  constructor(
    fileRepo: FileRepositoryOperator,
    strategy: StorageStrategy,
    idGenerator: IDGenerator
  ) {
    this.fileRepo = fileRepo;
    this.strategy = strategy;
    this.idGenerator = idGenerator;
  }

  /**
   * handles `POST /api/upload/image`.
   *
   * expects a `multipart/form-data` request with a single `file` field
   * (populated by multer before this handler runs). generates a UUID for
   * the upload, writes the file to the configured storage strategy under
   * the name `<uuid>.<ext>`, registers a `FileRecord` in the repository,
   * and returns the assigned ID and a publicly accessible URL.
   */
  async uploadImg(req: Request, resp: Response, nextFunc: NextFunction) {
    try {
      if (!req.file) {
        return resp.status(400).json({ error: 'No file provided.' });
      }

      const { originalname, mimetype, buffer } = req.file;
      // preserve the original extension while using a UUID as the base name
      // so filenames on disk are collision-free and opaque
      const ext = originalname.split('.').pop() ?? '';
      const id = this.idGenerator.generate();
      const storedFilename = `${id}.${ext}`;

      const record = this.fileRepo.saveFile(
        buffer,
        {
          id,
          filename: storedFilename,
          type: mimetype,
          create: new Date()
        },
        this.strategy
      );

      await this.strategy.write(storedFilename, buffer);
      const url = await this.strategy.resolvePath(storedFilename);

      return resp.status(200).json({
        success: true,
        data: {
          id: record.id,
          url
        }
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      nextFunc(error);
    }
  }

  async getImg(req: Request, resp: Response, nextFunc: NextFunction) {
    try {
      const imageID = req.params.id;
      if (!imageID) {
        return resp
          .status(400)
          .json({ error: 'No image id in request params.' });
      }
      const record = this.fileRepo.getFileById(imageID as string);

      if (!record) {
        return resp.status(404).json({ error: 'Image not found.' });
      }

      const imageUrl =
        record.localPath || (await this.strategy.resolvePath(record.filename));

      return resp.status(200).json({
        id: record.id,
        url: imageUrl
      });
    } catch (error) {
      console.error('Failed to get the picture:', error);
      nextFunc(error);
    }
  }
}
