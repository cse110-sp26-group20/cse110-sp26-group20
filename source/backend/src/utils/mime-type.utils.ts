// utils/mime-type.utils.ts
import { UnsupportedMimeTypeError } from '../errors/unsupported-mime-type.error';

/**
 * Supported image MIME types mapped to their corresponding file extensions.
 */
const SUPPORTED_IMAGE_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif'
};

/**
 * Validates the MIME type and returns the corresponding file extension.
 * @param mimeType - The MIME string to validate.
 * @returns The corresponding file extension (including the dot, e.g., '.png').
 * @throws {UnsupportedMimeTypeError} If the provided MIME type is not in the allowlist.
 */
export function getValidImageExtension(mimeType: string): string {
  // Fault tolerance: trim whitespace and convert to lowercase
  const normalizedMimeType = (mimeType || '').trim().toLowerCase();

  const extension = SUPPORTED_IMAGE_MIME_TYPES[normalizedMimeType];

  if (!extension) {
    throw new UnsupportedMimeTypeError(normalizedMimeType);
  }

  return extension;
}
