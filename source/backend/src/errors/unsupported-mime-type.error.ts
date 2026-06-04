export class UnsupportedMimeTypeError extends Error {
  public readonly mimeType: string;

  constructor(mimeType: string, message?: string) {
    super(message || `Unsupported MIME type: ${mimeType}`);
    this.name = 'UnsupportedMimeTypeError';
    this.mimeType = mimeType;

    // Ensure 'instanceof' works correctly when compiled to ES5
    Object.setPrototypeOf(this, UnsupportedMimeTypeError.prototype);
  }
}
