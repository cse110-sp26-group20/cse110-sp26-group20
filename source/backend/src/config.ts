import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  openaiApiKey: string;
}

/**
 * Some environment variables are critical for the application to run properly.
 * This function ensures that they are present and throws a meaningful error if they are missing
 * preventing silent failures
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: requireEnv('OPENAI_API_KEY')
};

export default config;
