import { Router } from 'express';

import { ImageController } from '../controllers/image.controller';

export function getImgRouter(controller: ImageController) {
  const router = Router();
  router.get('/:id', controller.getImg.bind(controller));
  return router;
}
