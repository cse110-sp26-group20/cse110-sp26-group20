import type { NextFunction, Request, Response } from 'express';

import type { StorageStrategy } from '../models/file-storage';
import type { FileRepositoryOperator } from '../models/file-system';
import { TemplateService } from '../services/template-service';

export class ImageController {
  fileRepo: FileRepositoryOperator;
  strategy: StorageStrategy;
  templateServ: TemplateService;
  constructor(
    fileRepo: FileRepositoryOperator,
    strategy: StorageStrategy,
    templateServ: TemplateService
  ) {
    this.fileRepo = fileRepo;
    this.strategy = strategy;
    this.templateServ = templateServ;
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

  getTemplates = (req: Request, res: Response) => {
    const cache = this.templateServ.templateCache;

    if (cache.length === 0) {
      return res.status(503).json({ error: 'Cache empty' });
    }

    return res.status(200).json(cache);
  };
}
