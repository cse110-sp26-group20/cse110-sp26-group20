import type { ImagePrompt } from './ImagePrompt';
import type { ImageResponse } from './ImageResponse';

// IoC
export interface IUniversalAIProvider {
  // async: Promise
  generateImage(prompt: ImagePrompt): Promise<ImageResponse>;
}
