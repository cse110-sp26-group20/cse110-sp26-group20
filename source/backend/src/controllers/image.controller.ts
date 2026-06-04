import type { NextFunction, Request, Response } from 'express';

import type { StorageStrategy } from '../models/file-storage';
import type { FileRepositoryOperator } from '../models/file-system';

export class ImageController {
  fileRepo: FileRepositoryOperator;
  strategy: StorageStrategy;
  constructor(fileRepo: FileRepositoryOperator, strategy: StorageStrategy) {
    this.fileRepo = fileRepo;
    this.strategy = strategy;
  }
  async getImg(req: Request, resp: Response, nextFunc: NextFunction) {
    try {
      const imageID = req.params.id;
      if (!imageID) {
        return resp.status(400).json({ error: 'no image id on the params.' });
      }
      const record = this.fileRepo.getFileById(imageID as string);

      if (!record) {
        return resp.status(404).json({ error: 'Image not found.' });
      }

      const imageUrl =
        record.localPath || (await this.stratage.resolvePath(record.filename));

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
