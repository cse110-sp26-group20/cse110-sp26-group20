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
    if (key) return this.arguments[key] as T;
  }

  public parseRawPromptToArgs(): void {
    const regex = /--([a-zA-Z0-9_]+)\s+([^-]+(?:\s+[^-]+)*)/g;
    let match;

    while ((match = regex.exec(this.rawPrompt)) !== null) {
      const [, matchedKey, matchedValue] = match;
      const key = (matchedKey || '').trim();
      const value = matchedValue?.trim();
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
