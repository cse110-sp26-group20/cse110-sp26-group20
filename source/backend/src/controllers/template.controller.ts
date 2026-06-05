import type { Request, Response } from 'express';

import { TemplateService } from '../services/template-service';

export class TemplateController {
  service: TemplateService;
  constructor(templateServ: TemplateService) {
    this.service = templateServ;
  }
  getTemplates = (req: Request, res: Response) => {
    const cache = this.service.templateCache;

    if (cache.length === 0) {
      return res.status(503).json({ error: 'Cache empty' });
    }

    return res.status(200).json(cache);
  };
}
