export class ImageData {
  constructor(
    public readonly payload: Uint8Array,
    public readonly format: string,
    public readonly width: number,
    public readonly height: number
  ) {}
}

export class ResponseMetadata {
  constructor(
    public readonly processingTimeMs: number,
    public readonly modelName: string,
    public readonly finishReason: string
  ) {}
}

export class ImageResponse {
  constructor(
    private readonly image: ImageData,
    private readonly metadata: ResponseMetadata
  ) {}

  public getImage(): ImageData {
    return this.image;
  }

  public getMetadata(): ResponseMetadata {
    return this.metadata;
  }
}

// The Dynamic Request Class

export class ImagePrompt {
  private rawPrompt: string;
  private arguments: Record<string, unknown>;

  constructor(rawPrompt: string, args: Record<string, unknown> = {}) {
    this.rawPrompt = rawPrompt;
    this.arguments = { ...args };
  }

  public setArgument(key: string, value: unknown): void {
    this.arguments[key] = value;
  }

  public getArgument<T>(key: string): T | undefined {
    return this.arguments[key] as T;
  }

  public parseRawPromptToArgs(): void {
    const regex = /--([a-zA-Z0-9_]+)\s+([^-]+(?:\s+[^-]+)*)/g;
    let match;

    while ((match = regex.exec(this.rawPrompt)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      this.setArgument(key, value);
    }

    // Clean the raw prompt by removing the parsed parameters
    this.rawPrompt = this.rawPrompt.replace(/--.*/, '').trim();
  }

  public getArgc(): number {
    return this.getArgv().length;
  }

  /**
   * Converts the arguments Record into a command-line style array.
   * Useful for providers that expect argc/argv style inputs.
   */
  public getArgv(): string[] {
    const argv: string[] = [];
    for (const [key, value] of Object.entries(this.arguments)) {
      argv.push(`--${key}`);
      if (typeof value === 'object' && value !== null) {
        argv.push(JSON.stringify(value));
      } else {
        argv.push(String(value));
      }
    }
    return argv;
  }

  public getRawPrompt(): string {
    return this.rawPrompt;
  }
}

// IoC

export interface IUniversalAIProvider {
  // async: Promise
  generateImage(prompt: ImagePrompt): Promise<ImageResponse>;
}

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
