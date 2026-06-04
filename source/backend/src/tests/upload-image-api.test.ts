import type { NextFunction, Request, Response } from 'express';

import { ImageController } from '../controllers/image.controller';
import { StorageStrategy } from '../models/file-storage';
import type { FileRecord, FileRepositoryOperator } from '../models/file-system';
import type { IDGenerator } from '../models/id-generator';

const FAKE_ID = 'test-uuid-1234';

describe('ImageController.uploadImg', () => {
  let mockFileRepo: jest.Mocked<FileRepositoryOperator>;
  let mockStorageStrategy: jest.Mocked<StorageStrategy>;
  let mockIdGenerator: jest.Mocked<IDGenerator>;
  let imageController: ImageController;

  let mockRequest: Partial<Request> & { file?: Express.Multer.File };
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const fakeSavedRecord: FileRecord = {
    id: FAKE_ID,
    filename: `${FAKE_ID}.jpg`,
    localPath: '',
    type: 'image/jpeg',
    create: new Date(),
    matedata: {}
  };

  beforeEach(() => {
    mockIdGenerator = {
      generate: jest.fn().mockReturnValue(FAKE_ID)
    };
    mockFileRepo = {
      saveFile: jest.fn().mockReturnValue(fakeSavedRecord),
      getFileById: jest.fn(),
      getFileStream: jest.fn()
    };
    mockStorageStrategy = {
      resolvePath: jest.fn().mockResolvedValue(`/uploads/${FAKE_ID}.jpg`),
      read: jest.fn(),
      write: jest.fn().mockResolvedValue(`/uploads/${FAKE_ID}.jpg`),
      remove: jest.fn()
    };

    imageController = new ImageController(
      mockFileRepo,
      mockStorageStrategy,
      mockIdGenerator
    );

    mockRequest = {};

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

  test('when no file is provided, returns 400', async () => {
    mockRequest.file = undefined;

    await imageController.uploadImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No file provided.'
    });
    expect(mockFileRepo.saveFile).not.toHaveBeenCalled();
  });

  test('when file is provided, saves and returns id and url', async () => {
    mockRequest.file = {
      fieldname: 'file',
      originalname: 'photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake image data'),
      size: 15,
      stream: null as never,
      destination: '',
      filename: '',
      path: ''
    };

    await imageController.uploadImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockIdGenerator.generate).toHaveBeenCalled();
    expect(mockFileRepo.saveFile).toHaveBeenCalledWith(
      mockRequest.file.buffer,
      expect.objectContaining({
        id: FAKE_ID,
        filename: `${FAKE_ID}.jpg`,
        type: 'image/jpeg'
      }),
      mockStorageStrategy
    );
    expect(mockStorageStrategy.write).toHaveBeenCalledWith(
      `${FAKE_ID}.jpg`,
      mockRequest.file.buffer
    );
    expect(mockStorageStrategy.resolvePath).toHaveBeenCalledWith(
      `${FAKE_ID}.jpg`
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: {
        id: FAKE_ID,
        url: `/uploads/${FAKE_ID}.jpg`
      }
    });
  });

  test('when strategy.write throws, forwards error to next()', async () => {
    const err = new Error('disk full');
    mockStorageStrategy.write.mockRejectedValue(err);

    mockRequest.file = {
      fieldname: 'file',
      originalname: 'photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake image data'),
      size: 15,
      stream: null as never,
      destination: '',
      filename: '',
      path: ''
    };

    await imageController.uploadImg(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(err);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
