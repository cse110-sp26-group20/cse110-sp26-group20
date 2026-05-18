import express from 'express';
import config from './config';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ success: true });
});

app.listen(config.port, () => {
  console.log(`App started: http://localhost:${config.port}`);
});

export default app;
