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
