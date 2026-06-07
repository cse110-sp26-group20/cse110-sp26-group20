import type { NextFunction, Request, Response } from 'express';

import { ImageController } from '../controllers/image.controller';
import type { StorageStrategy } from '../models/file-storage';
import type { FileRecord, FileRepositoryOperator } from '../models/file-system';

describe('ImageController', () => {
  let mockFileRepo: jest.Mocked<FileRepositoryOperator>;
  let mockStrategy: jest.Mocked<StorageStrategy>;
  let imageController: ImageController;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  let imgRelativePath = '/uploads'

  beforeEach(() => {
    mockFileRepo = {
      saveFile: jest.fn(),
      getFileById: jest.fn(),
      getFileStream: jest.fn()
    };

    mockStrategy = {
      write: jest.fn(),
      read: jest.fn(),
      remove: jest.fn(),
      resolvePath: jest.fn()
    } as jest.Mocked<StorageStrategy>;


    imageController = new ImageController(mockFileRepo, mockStrategy, imgRelativePath);

    mockRequest = {
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('when id param is missing, returns 400', async () => {
    mockRequest.params = {};

    await imageController.getImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No image id in request params.'
    });

    expect(mockFileRepo.getFileById).not.toHaveBeenCalled();
  });

  test('when file record is missing, returns 404', async () => {
    mockRequest.params = { id: '999' };
    mockFileRepo.getFileById.mockReturnValue(undefined);

    await imageController.getImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockFileRepo.getFileById).toHaveBeenCalledWith('999');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Image not found.'
    });
  });

  test('when record exists, returns id and localPath as url', async () => {
    mockRequest.params = { id: '1' };
    const mockRecord: FileRecord = {
      id: '1',
      filename: `1.png`,
      localPath: 'C://uploads/1.png',
      type: '',
      create: new Date(),
      metadata: {}
    };
    mockFileRepo.getFileById.mockReturnValue(mockRecord);

    await imageController.getImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: '1',
      url: `${imgRelativePath}/1.png`
    });
  });

  test('when getFileById throws, forwards error to next()', async () => {
    mockRequest.params = { id: '1' };
    const err = new Error('boom');
    mockFileRepo.getFileById.mockImplementation(() => {
      throw err;
    });

    await imageController.getImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(err);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
