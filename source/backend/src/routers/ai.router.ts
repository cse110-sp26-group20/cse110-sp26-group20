import express from 'express';

import { AIController } from '../controllers/ai.controller';

export function createAIRouter(aiController: AIController) {
  const router = express.Router();
  router.post('/', aiController.generateResponse);
  return router;
}
