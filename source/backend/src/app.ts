import 'dotenv/config';

import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { isHttpError } from 'http-errors';
import { createAIRouter } from './routers/ai.router';
import { OpenAIProvider } from './services/openai-provider';
import { AIController } from './controllers/ai.controller';
import type { IUniversalAIProvider } from './models/universal-ai-provider';
import { FileRecord, type FileRepositoryOperator } from './models/file-system';
import { NoStorageStrategy } from './models/file-storage';

const app = express();

app.use(express.json());

// IoC for aiController
const aiGenerator:IUniversalAIProvider = new OpenAIProvider();
const fakeFileRepo = {
  saveFile(_file, metadata, _strategy) {
    console.log('do nothing!!!');
    return metadata;
  },
} as FileRepositoryOperator;
const aiController = new AIController(aiGenerator,fakeFileRepo, new NoStorageStrategy());
const aiRouter = createAIRouter(aiController);

app.use('/api/ai', aiRouter);
// app.use("/api/images", imageRouter);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 *
 * An eslint-disable is being used below because the "next" argument is never used. However,
 * it is still required for Express to recognize it as an error handler. For this reason, I've
 * disabled the eslint error. This should be used sparingly and only in situations where the lint
 * error cannot be fixed in another way.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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
