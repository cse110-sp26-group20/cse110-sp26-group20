import type { Request, Response } from 'express';

import { AIController, AIController } from '../controllers/ai.controller';
import { NoStorageStrategy } from '../models/file-storage';
import type { FileRepositoryOperator } from '../models/file-system';
import { ImagePrompt } from '../models/image-prompt';
import type { IUniversalAIProvider } from '../models/universal-ai-provider';

describe('AIController', () => {
  let aiController: AIController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockGenerator: jest.Mocked<IUniversalAIProvider>;
  let mockFileRepo: jest.Mocked<FileRepositoryOperator>;

  beforeEach(async () => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockGenerator = {
      generateImage: jest.fn()
    } as unknown as jest.Mocked<IUniversalAIProvider>;

    mockFileRepo = {
      saveFile: jest.fn(),
      getFileById: jest.fn(),
      getFileStream: jest.fn()
    } as unknown as jest.Mocked<FileRepositoryOperator>;

    aiController = new AIController(
      mockGenerator,
      mockFileRepo,
      new NoStorageStrategy()
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return 400 if prompt is missing', async () => {
    mockReq.body = {};

    await aiController.generateResponse(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Prompt is required' });
    expect(mockGenerator.generateImage).not.toHaveBeenCalled();
  });

  it('should return 200 and image data on success', async () => {
    mockReq.body = { prompt: 'a cute cat' };

    const fakePayload = Buffer.from('fake-image-data');
    mockGenerator.generateImage.mockResolvedValueOnce({
      getImage: () => ({
        payload: fakePayload,
        format: 'png',
        width: 1024,
        height: 1024
      }),
      getMetadata: () => ({ revised_prompt: 'a very cute cat' })
    } as any);

    mockFileRepo.saveFile.mockReturnValueOnce({
      id: '1',
      localPath: 'test'
    } as any);

    await aiController.generateResponse(
      mockReq as Request,
      mockRes as Response
    );

    expect(mockGenerator.generateImage).toHaveBeenCalledTimes(1);
    expect(mockGenerator.generateImage).toHaveBeenCalledWith(
      expect.any(ImagePrompt)
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: '1',
      url: 'test'
    });
    expect(mockFileRepo.saveFile).toHaveBeenCalledTimes(1);
  });
});
