import { Router } from 'express';
import multer from 'multer';

import { ImageController } from '../controllers/image.controller';

const upload = multer({ storage: multer.memoryStorage() });

export function getUploadRouter(controller: ImageController) {
  const router = Router();
  router.post(
    '/image',
    upload.single('file'),
    controller.uploadImg.bind(controller)
  );
  return router;
}
