import type { Request, Response } from 'express';

import { AIController } from '../controllers/ai.controller';
import { NoStorageStrategy } from '../models/file-storage';
import type { FileRecord, FileRepositoryOperator } from '../models/file-system';
import { ImagePrompt } from '../models/image-prompt';
import type { ImageResponse } from '../models/image-response';
import type { IUniversalAIProvider } from '../models/universal-ai-provider';

describe('AIController', () => {
  let aiController: AIController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockGenerator: jest.Mocked<IUniversalAIProvider>;
  let mockFileRepo: jest.Mocked<FileRepositoryOperator>;
  const noStrategy = new NoStorageStrategy();

  const makeFakeImageResponse = (
    payload = new Uint8Array(Buffer.from('fake-image-data'))
  ) =>
    ({
      getImage: () => ({ payload, format: 'png', width: 1024, height: 1024 }),
      getMetadata: () => ({ revised_prompt: 'a very cute cat' })
    }) as unknown as ImageResponse;

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

    aiController = new AIController(mockGenerator, mockFileRepo, noStrategy, '/static');
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });
  describe('Error handling', () => {
    it('should return 400 if prompt is missing', async () => {
      mockReq.body = {
        imageId: '1'
      };

      await aiController.generateResponse(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Prompt is required'
      });
      expect(mockFileRepo.getFileById).not.toHaveBeenCalled();
      expect(mockGenerator.generateImage).not.toHaveBeenCalled();
    });

    it('should return 400 if ID is missing', async () => {
      mockReq.body = {
        prompt: 'prompt'
      };

      await aiController.generateResponse(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Valid imageId is required'
      });
      expect(mockFileRepo.getFileById).not.toHaveBeenCalled();
      expect(mockGenerator.generateImage).not.toHaveBeenCalled();
    });

    it('should return 404 if file is not found', async () => {
      mockReq.body = {
        prompt: 'prompt',
        imageId: '1'
      };

      mockFileRepo.getFileById.mockReturnValueOnce(undefined);

      await aiController.generateResponse(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Image not found' });
      expect(mockFileRepo.getFileById).toHaveBeenCalledTimes(1);
      expect(mockGenerator.generateImage).not.toHaveBeenCalled();
    });

    it('should return 404 if file is not found', async () => {
      mockReq.body = {
        prompt: 'prompt',
        imageId: 'existing-id'
      };

      mockFileRepo.getFileById.mockReturnValueOnce(undefined);

      await aiController.generateResponse(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Image not found' });
      expect(mockFileRepo.getFileById).toHaveBeenCalledTimes(1);
      expect(mockGenerator.generateImage).not.toHaveBeenCalled();
    });
  });

  describe('Interaction verification', () => {
    it('should call getFileById with the provided imageId', async () => {
      mockReq.body = { prompt: 'a cute cat', imageId: 'existing-id' };
      const playload = new Uint8Array(Buffer.from('test'));
      mockGenerator.generateImage.mockResolvedValueOnce(
        makeFakeImageResponse(playload)
      );

      mockFileRepo.getFileById.mockReturnValueOnce({
        id: 'existing-id',
        filename: 'input.png',
        localPath: '/tmp/input.png',
        type: 'image/png',
        create: new Date(),
        matedata: {}
      } as unknown as FileRecord);

      mockFileRepo.saveFile.mockResolvedValueOnce({
        id: 'newID',
        filename: 'newID.png',
        localPath: '/tmp/new.png'
      } as FileRecord);

      await aiController.generateResponse(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockFileRepo.getFileById).toHaveBeenCalledWith('existing-id');
      expect(mockFileRepo.getFileStream).toHaveBeenCalledWith(
        'existing-id',
        noStrategy
      );

      expect(mockFileRepo.saveFile).toHaveBeenCalledWith(
        Buffer.from(playload),
        {
          filename: `image.${makeFakeImageResponse().getImage().format}`,
          type: makeFakeImageResponse().getImage().format
        },
        noStrategy
      );
      expect(mockGenerator.generateImage).toHaveBeenCalledTimes(1);
      expect(mockGenerator.generateImage).toHaveBeenCalledWith(
        expect.any(ImagePrompt)
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 'newID',
        url: '/static/newID.png'
      });
      expect(mockFileRepo.saveFile).toHaveBeenCalledTimes(1);
    });
  });
});
