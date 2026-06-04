import type { NextFunction, Request, Response } from 'express';

import { ImageController } from '../controllers/image.controller';
import { StorageStrategy } from '../models/file-storage';
import type { FileRecord, FileRepositoryOperator } from '../models/file-system';

describe('ImageController', () => {
  let mockFileRepo: jest.Mocked<FileRepositoryOperator>;
  let mockStorageStrategy: jest.Mocked<StorageStrategy>;
  let imageController: ImageController;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockFileRepo = {
      saveFile: jest.fn(),
      getFileById: jest.fn(),
      getFileStream: jest.fn()
    };
    mockStorageStrategy = {
      resolvePath: jest.fn(),
      read: jest.fn(),
      write: jest.fn(),
      remove: jest.fn()
    };

    imageController = new ImageController(mockFileRepo, mockStorageStrategy);

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
      error: 'no image id on the params.'
    });

    expect(mockFileRepo.getFileById).not.toHaveBeenCalled();
    expect(mockStorageStrategy.resolvePath).not.toHaveBeenCalled();
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
  test('when localPath exists, returns it without calling the strategy', async () => {
    mockRequest.params = { id: '1' };
    const mockRecord: FileRecord = {
      id: '1',
      filename: 'avatar.png',
      localPath: '/static/avatar.png',
      type: '',
      create: new Date(),
      matedata: {}
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
      url: '/static/avatar.png'
    });
    expect(mockStorageStrategy.resolvePath).not.toHaveBeenCalled();
  });

  test('if NOT a localPath is existed, stratage should be called.', async () => {
    mockRequest.params = { id: '1' };
    const mockRecord: FileRecord = {
      id: '1',
      filename: 'avatar.png',
      localPath: '',
      type: '',
      create: new Date(),
      matedata: {}
    };
    mockStorageStrategy.resolvePath.mockResolvedValue('/static/avatar.png');
    mockFileRepo.getFileById.mockReturnValue(mockRecord);
    await imageController.getImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: '1',
      url: '/static/avatar.png'
    });
    expect(mockStorageStrategy.resolvePath).toHaveBeenCalledWith(
      mockRecord.filename
    );
  });
});
