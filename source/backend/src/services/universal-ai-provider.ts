import type { ImagePrompt } from '../models/image-prompt';
import type { ImageResponse } from '../models/image-response';

// IoC
export interface IUniversalAIProvider {
  // async: Promise
  generateImage(prompt: ImagePrompt): Promise<ImageResponse>;
}
