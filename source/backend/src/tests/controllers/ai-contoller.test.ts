import type { Request, Response } from 'express';

import { generateResponse } from '../../controllers/ai.controller';

describe('AI Controller', () => {
  it('should return 400 if prompt is missing', async () => {
    const req = { body: {} } as Partial<Request> as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as Partial<Response> as Response;

    await generateResponse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Prompt is required' });
  });
});
