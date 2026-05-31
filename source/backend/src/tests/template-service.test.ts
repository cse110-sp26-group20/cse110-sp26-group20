import type { Request } from 'express';
import { getTemplates } from '../controllers/image.controller';
import { bootstrapTemplates, templateCache } from '../services/template-service';

describe('TemplateService', () => {
  //reset cache
  beforeEach(() => {
    templateCache.length = 0; 
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

    const fakeNetworkResponse: any = {
      json: async () => { //represents awaiting imgflip response
        return fakeImgflipData;
      },
      arrayBuffer: async () => { //represents awaiting imagebuffer
        return new ArrayBuffer(0);
      }
    };

    global.fetch = async () => {
      return fakeNetworkResponse;
    };

    await bootstrapTemplates();

    expect(templateCache.length).toBe(1);
    expect(templateCache[0]?.name).toBe('Fake Meme');
  });

  test('bootstrapTemplates() leaves cache empty if API fails', async () => {
    // network crashes, so api fails
    global.fetch = async () => { throw new Error('Network Down'); };

    await bootstrapTemplates();

    expect(templateCache.length).toBe(0);
  });
});

describe('ImageController', () => {
  beforeEach(() => {
    templateCache.length = 0; 
  });

  test('getTemplates() returns 503 when cache is empty', () => {
    let statusCode = 0;
    const fakeResponse: any = {};
    fakeResponse.status = (code: number) => {
      statusCode = code;
      return fakeResponse; 
    };
    fakeResponse.json = () => {
      return fakeResponse;
    };

    const req = {} as Request;

    getTemplates(req, fakeResponse);

    expect(statusCode).toBe(503);
  });

  test('push a fake meme, getTemplates() returns 200 when cache contains data', () => {
    templateCache.push({ id: '11423', name: 'Fake Meme', url: 'http', width: 500, height: 500 });
    
    let statusCode = 0;
    //fake express response
    const fakeResponse: any = {};
    //assigns the status code
    fakeResponse.status = (code: number) => {
      statusCode = code;
      return fakeResponse; 
    };
    //simulates sending the meme data
    fakeResponse.json = () => {
      return fakeResponse;
    };

    const req = {} as Request;

    getTemplates(req, fakeResponse);

    expect(statusCode).toBe(200);
  });
});