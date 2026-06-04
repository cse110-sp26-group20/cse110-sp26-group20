import 'dotenv/config';

import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { isHttpError } from 'http-errors';

import { getImgRouter } from './routers/image.router';
import { ImageController } from './controllers/image.controller';
import { TemplateService } from './services/template-service';

import { NoStorageStrategy } from './models/file-storage';
import type { FileRepositoryOperator } from './models/file-system';


const strategy = new NoStorageStrategy();

//temp mock repo
const tempFileRepo = {
  saveFile: () => ({ id: '123' }),
  getFileById: () => undefined,
  getFileStream: () => { throw new Error('Not implemented'); }
} as unknown as FileRepositoryOperator;

const templateService = new TemplateService(tempFileRepo, strategy);
const imageController = new ImageController(tempFileRepo, strategy, templateService);


const app = express();

app.use(express.json());

// app.use("/api/ai", aiRouter);
app.use('/api/images', getImgRouter(imageController));

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 *
 * An eslint-disable is being used below because the "next" argument is never used. However,
 * it is still required for Express to recognize it as an error handler. For this reason, I've
 * disabled the eslint error. This should be used sparingly and only in situations where the lint
 * error cannot be fixed in another way.
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
