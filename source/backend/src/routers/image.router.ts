import { Router } from 'express';
import multer from 'multer';

import { ImageController } from '../controllers/image.controller';

// keep uploaded bytes in memory so the controller can pass the buffer directly
// to the storage strategy without a redundant temp-file read
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  }
});

/**
 * returns a router that handles all image routes.
 * mounted at `/api/img` in `app.ts`.
 *
 * routes:
 *   GET  /:id — retrieve image metadata by ID
 *   POST /    — upload a single image via the `file` field
 */
export function getImgRouter(controller: ImageController) {
  const router = Router();
  router.get('/templates', controller.getTemplates);
  router.get('/:id', controller.getImg.bind(controller));
  router.post(
    '/',
    upload.single('file'),
    controller.uploadImg.bind(controller)
  );
  return router;
}
