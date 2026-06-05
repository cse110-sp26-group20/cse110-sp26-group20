import { Router } from 'express';

import { TemplateController } from '../controllers/template.controller';

export function getTempRouter(controller: TemplateController) {
  const router = Router();
  router.get('/', controller.getTemplates);
  return router;
}
