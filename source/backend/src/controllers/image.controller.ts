import type { Request, Response } from 'express';

import { templateCache } from '../services/template-service';

export const getTemplates = (_req: Request, res: Response) => {
  if (templateCache.length === 0) {
    res
      .status(503)
      .json({ error: 'Template library is currently loading or unavailable.' });
    return;
  }

  res.status(200).json(templateCache);
};
