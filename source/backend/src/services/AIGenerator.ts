import type { ImagePrompt } from '../models/ImagePrompt';
import type { ImageResponse } from '../models/ImageResponse';
import type { IUniversalAIProvider } from '../models/UniversalAIProvider';

export class AIGenerator {
  private provider: IUniversalAIProvider;
  private timeoutMs: number = 5000; // Default 5s or set by the *.config files
  private maxRetries: number = 3;

  // Dependency Injection
  constructor(provider: IUniversalAIProvider) {
    this.provider = provider;
  }

  public setTimeout(timeoutMs: number): void {
    this.timeoutMs = timeoutMs;
  }

  public async execute(prompt: ImagePrompt): Promise<ImageResponse> {
    console.log(
      `[AIGenerator] Starting generation with timeout ${this.timeoutMs}ms...`
    );
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
