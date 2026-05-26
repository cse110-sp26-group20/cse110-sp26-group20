import type { ImagePrompt } from './image-prompt';
import type { ImageResponse } from './image-response';

// IoC
export interface IUniversalAIProvider {
  // async: Promise
  generateImage(prompt: ImagePrompt): Promise<ImageResponse>;
}
