import 'dotenv/config';

import { join } from 'path';
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { isHttpError } from 'http-errors';

import { ImageController } from './controllers/image.controller';
import { UUIDGenerator } from './models/id-generator';
import { InMemoryFileRepository } from './models/in-memory-file-repository';
import { LocalStorageStrategy } from './models/local-storage-strategy';
import { getImgRouter } from './routers/image.router';

// resolve uploads directory relative to the process working directory so the
// path stays consistent regardless of how the server is invoked
const uploadDir = join(process.cwd(), 'uploads');

const idGenerator = new UUIDGenerator();
const storageStrategy = new LocalStorageStrategy(uploadDir);
const fileRepository = new InMemoryFileRepository(idGenerator, storageStrategy);
const imageController = new ImageController(fileRepository);

const app = express();

app.use(express.json());
// serve uploaded files as static assets under the same path that
// resolvePath() returns, e.g. GET /uploads/abc123.jpg
app.use('/uploads', express.static(uploadDir));

app.use('/api/img', getImgRouter(imageController));

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings are required here because TypeScript cannot infer the argument types.
 */
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorMessage = 'An error has occurred.';

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
