import app from './app';
import config from './config';
import { bootstrapTemplates } from './services/template-service';

bootstrapTemplates().then(() => {
  app.listen(config.port, () => {
    console.log(`App started: http://localhost:${config.port}`);
  });
});
