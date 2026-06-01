import type { Request, Response } from 'express';

import { getTemplates } from '../controllers/image.controller';
import {
  bootstrapTemplates,
  templateCache
} from '../services/template-service';

describe('TemplateService', () => {
  const originalFetch = global.fetch;

  //reset cache
  beforeEach(() => {
    templateCache.length = 0;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  test('bootstrapTemplates() fetches and saves memes', async () => {
    const fakeImgflipData = {
      success: true,
      data: {
        memes: [
          { id: '41242', name: 'Fake Meme', url: 'http', width: 10, height: 10 }
        ]
      }
    };

    const fakeNetworkResponse = {
      json: async () => fakeImgflipData,
      arrayBuffer: async () => new ArrayBuffer(0)
    };

    global.fetch = (() =>
      Promise.resolve(fakeNetworkResponse)) as unknown as typeof fetch;

    await bootstrapTemplates();

    expect(templateCache.length).toBe(1);
    expect(templateCache[0]?.name).toBe('Fake Meme');
  });

  test('bootstrapTemplates() leaves cache empty if API fails', async () => {
    // network crashes, so api fails
    global.fetch = async () => {
      throw new Error('Network Down');
    };

    await bootstrapTemplates();

    expect(templateCache.length).toBe(0);
  });
});

describe('ImageController', () => {
  beforeEach(() => {
    templateCache.length = 0;
  });

  test('getTemplates() returns 503 when cache is empty', () => {
    const fakeResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(), //jest.fn() records info like status code or meme data
      json: jest.fn().mockReturnThis() //mockReturnThis() returns an actual object
    };

    const req = {} as Request;

    getTemplates(req, fakeResponse as Response);

    expect(fakeResponse.status).toHaveBeenCalledWith(503);
  });

  test('push a fake meme, getTemplates() returns 200 when cache contains data', () => {
    const fake = {
      id: '11423',
      name: 'Fake Meme',
      url: 'http',
      width: 500,
      height: 500
    };
    templateCache.push(fake);

    const fakeResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    const req = {} as Request;

    getTemplates(req, fakeResponse as Response);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.json).toHaveBeenCalledWith([fake]);
  });
});
