import type { Request, Response } from 'express';

import { TemplateController } from '../controllers/template.controller';
import { NoStorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import { TemplateService } from '../services/template-service';

const fakeRepo: jest.Mocked<FileRepositoryOperator> = {
  saveFile: jest
    .fn()
    .mockReturnValue(
      new FileRecord(
        '123',
        'fake.jpg',
        '/mock/path.jpg',
        'image/jpeg',
        new Date(),
        {}
      )
    ),
  getFileById: jest.fn(),
  getFileStream: jest.fn()
};

const fakeStrategy = new NoStorageStrategy();

describe('TemplateService', () => {
  const originalFetch = global.fetch;
  let templateService: TemplateService;

  //creates new instance of template service before every test
  beforeEach(() => {
    templateService = new TemplateService(fakeRepo, fakeStrategy, '/static');
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

    await templateService.bootstrapTemplates();

    expect(templateService.templateCache.length).toBe(1);
    expect(templateService.templateCache[0]?.name).toBe('Fake Meme');
    expect(templateService.templateCache[0]?.url).toBe(
      `/static/${fakeRepo.saveFile.mock.results[0]?.value.filename}`
    );
  });

  test('bootstrapTemplates() leaves cache empty if API fails', async () => {
    // network crashes, so api fails
    global.fetch = async () => {
      throw new Error('Network Down');
    };

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    try {
      await templateService.bootstrapTemplates();
    } finally {
      consoleSpy.mockRestore();
    }

    expect(templateService.templateCache.length).toBe(0);
    expect(templateService.templateCache.length).toBe(0);
  });
});

describe('TemplateController', () => {
  let templateService: TemplateService;
  let tempController: TemplateController;

  beforeEach(() => {
    templateService = new TemplateService(fakeRepo, fakeStrategy, '/static');
    tempController = new TemplateController(templateService);
  });

  test('getTemplates() returns 503 when cache is empty', () => {
    const fakeResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(), //jest.fn() records info like status code or meme data
      json: jest.fn().mockReturnThis() //mockReturnThis() returns an actual object
    };

    const req = {} as Request;

    tempController.getTemplates(req, fakeResponse as Response);

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
    templateService.templateCache.push(fake);

    const fakeResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    const req = {} as Request;

    tempController.getTemplates(req, fakeResponse as Response);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.json).toHaveBeenCalledWith([fake]);
  });
});
