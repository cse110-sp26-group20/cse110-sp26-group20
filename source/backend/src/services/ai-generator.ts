import type { ImagePrompt } from '../models/image-prompt';
import type { ImageResponse } from '../models/image-response';
import type { IUniversalAIProvider } from '../models/universal-ai-provider';

/**
 * Overdesign note: this wrapper is kept for demo/tests.
 * Prefer injecting an `IUniversalAIProvider` directly where possible.
 */
export class AIGenerator {
  private provider: IUniversalAIProvider;

  // Dependency Injection
  constructor(provider: IUniversalAIProvider) {
    this.provider = provider;
  }

  public async execute(prompt: ImagePrompt): Promise<ImageResponse> {
    console.log(`[AIGenerator] Starting generation...`);
    try {
      const response = await this.provider.generateImage(prompt);
      console.log(`[AIGenerator] Generation successful.`);
      return response;
    } catch (error) {
      console.error(`[AIGenerator] Generation failed:`, error);
      throw error;
    }
  }
}
