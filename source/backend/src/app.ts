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
import { createAIRouter } from './routers/ai.router';
import { getImgRouter } from './routers/image.router';
import { getTempRouter } from './routers/template.router';
import { FileRepository } from './services/file-repository';
import { LocalStorageStrategy } from './services/local-storage-strategy';
import { OpenAIProvider } from './services/openai-provider';
import { TemplateService } from './services/template-service';

// resolve uploads directory relative to the process working directory so the
// path stays consistent regardless of how the server is invoked
const uploadDir = join(process.cwd(), 'uploads');

// static files
const imgRelativePath = '/static';

const idGenerator = new UUIDGenerator();
const storageStrategy = new LocalStorageStrategy(uploadDir);
const fileRepository = new FileRepository(idGenerator);
const templateService = new TemplateService(
  fileRepository,
  storageStrategy,
  imgRelativePath
);
const imageController = new ImageController(
  fileRepository,
  storageStrategy,
  imgRelativePath
);
const tempController = new TemplateController(templateService);

// IoC for aiController
const aiGenerator = new OpenAIProvider(
  new OpenAI({ apiKey: config.openaiApiKey })
);
const aiController = new AIController(
  aiGenerator,
  fileRepository,
  storageStrategy
);

// this part was needed for backend testing too see the file ids generated on startup
// Additionally these id are needed for testing the ai provider
await templateService.bootstrapTemplates();
fileRepository.getAllFiles().forEach((record) => {
  console.log(`File record on startup: ${record.id} (${record.filename})`);
});

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files as static assets under the same path that
// resolvePath() returns, e.g. GET /uploads/abc123.jpg
app.use(imgRelativePath, express.static(uploadDir));

app.use('/api/img', getImgRouter(imageController));
app.use('/api/template', getTempRouter(tempController));
app.use('/api/ai', createAIRouter(aiController));

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
