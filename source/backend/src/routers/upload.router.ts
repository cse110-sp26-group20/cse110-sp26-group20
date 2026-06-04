import { Router } from 'express';
import multer from 'multer';

import { ImageController } from '../controllers/image.controller';

// keep uploaded bytes in memory so the controller can pass the buffer directly
// to the storage strategy without a redundant temp-file read
const upload = multer({ storage: multer.memoryStorage() });

/**
 * returns a router that handles file upload routes.
 * mounted at `/api/upload` in `app.ts`.
 *
 * routes:
 *   POST /image — upload a single image via the `file` field
 */
export function getUploadRouter(controller: ImageController) {
  const router = Router();
  router.post(
    '/image',
    upload.single('file'),
    controller.uploadImg.bind(controller)
  );
  return router;
}
