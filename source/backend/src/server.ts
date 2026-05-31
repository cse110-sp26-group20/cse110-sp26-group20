import app from './app';
import config from './config';
import { bootstrapTemplates } from './services/template-service';

void bootstrapTemplates();

app.listen(config.port, () => {
  console.log(`App started: http://localhost:${config.port}`);
});
