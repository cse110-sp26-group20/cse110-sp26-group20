import type { NextFunction, Request, Response } from 'express';

import type { StorageStrategy } from '../models/file-storage';
import type { FileRepositoryOperator } from '../models/file-system';
import { TemplateService } from '../services/template-service';

export class ImageController {
  fileRepo: FileRepositoryOperator;
  strategy: StorageStrategy;
  imgRelativePath: string;
  constructor(
    fileRepo: FileRepositoryOperator,
    strategy: StorageStrategy,
    path: string
  ) {
    this.fileRepo = fileRepo;
    this.strategy = strategy;
    this.imgRelativePath = path;
  }

  /**
   * handles `POST /api/img`.
   *
   * expects a `multipart/form-data` request with a single `file` field
   * (populated by multer before this handler runs). delegates to the
   * repository, which generates a unique ID, writes the file via its
   * injected storage strategy, and returns the saved record with the
   * public URL in `localPath`.
   */
  async uploadImg(req: Request, resp: Response, nextFunc: NextFunction) {
    try {
      if (!req.file) {
        return resp.status(400).json({ error: 'No file provided.' });
      }

      const { originalname, mimetype, buffer } = req.file;
      const record = await this.fileRepo.saveFile(
        buffer,
        {
          filename: originalname,
          type: mimetype,
          create: new Date()
        },
        this.strategy
      );

      return resp.status(200).json({
        success: true,
        data: {
          id: record.id,
          url: record.localPath
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

      return resp.status(200).json({
        id: record.id,
        url: `${this.imgRelativePath}/${record.filename}`
      });
    } catch (error) {
      console.error('Failed to get the picture:', error);
      nextFunc(error);
    }
  }
}
