import 'dotenv/config';

import { join } from 'path';
import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { isHttpError } from 'http-errors';
import { OpenAI } from 'openai';

import config from './config';
import { AIController } from './controllers/ai.controller';
import { ImageController } from './controllers/image.controller';
import { TemplateController } from './controllers/template.controller';
import { UUIDGenerator } from './models/id-generator';
import { InMemoryFileRepository } from './models/in-memory-file-repository';
import { createAIRouter } from './routers/ai.router';
import { getImgRouter } from './routers/image.router';
import { getTempRouter } from './routers/template.router';
import { LocalStorageStrategy } from './services/local-storage-strategy';
import { OpenAIProvider } from './services/openai-provider';
import { TemplateService } from './services/template-service';

// resolve uploads directory relative to the process working directory so the
// path stays consistent regardless of how the server is invoked
const uploadDir = join(process.cwd(), 'uploads');

const idGenerator = new UUIDGenerator();
const storageStrategy = new LocalStorageStrategy(uploadDir);
const fileRepository = new InMemoryFileRepository(idGenerator);
const templateService = new TemplateService(fileRepository, storageStrategy);
const imageController = new ImageController(fileRepository, storageStrategy);
const tempController = new TemplateController(templateService);

// IoC for aiController
// const aiGenerator = new OpenAIProvider(
//   new OpenAI({ apiKey: config.openaiApiKey })
// );
// const aiController = new AIController(aiGenerator,fileRepository,storageStrategy);

templateService.bootstrapTemplates();

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files as static assets under the same path that
// resolvePath() returns, e.g. GET /uploads/abc123.jpg
app.use('/uploads', express.static(uploadDir));

app.use('/api/img', getImgRouter(imageController));
app.use('/api/template', getTempRouter(tempController));
// app.use('/api/template', createAIRouter(aiController));

/**
 * Example usage:
 * const coreImageService = new ImageGenerationService();
 * const proxiedImageService = createTimerLogProxy(coreImageService, 'ImageGenerationService');
 * const imageController = new ImageController(proxiedImageService);
 */

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings are required here because TypeScript cannot infer the argument types.
 */
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
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
