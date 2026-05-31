import { Router } from 'express';

import { getTemplates } from '../controllers/image.controller';

const router = Router();

router.get('/templates', getTemplates);

export default router;
