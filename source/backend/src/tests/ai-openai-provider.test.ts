import { Readable } from 'stream';
import { OpenAI } from 'openai';

import { ImagePrompt } from '../models/image-prompt';
import type { ImageResponse } from '../models/image-response';
import { type IUniversalAIProvider } from '../models/universal-ai-provider';
import { OpenAIProvider } from '../services/openai-provider';

/**
 * TODO: Test the ai provider first.
 * Focus on the provider don't care about file-repository or others.
 */
describe('Open AI Generator', () => {
  let ai: IUniversalAIProvider;
  let mockClient: OpenAI;
  let mockImages: { edit: jest.Mock };

  beforeAll(() => {
    mockImages = {
      edit: jest.fn()
    };
    mockClient = {
      images: mockImages
    } as unknown as OpenAI;
    ai = new OpenAIProvider(mockClient);
  });

  test('generate() with prompt calls OpenAI API and returns ImageResponse', async () => {
    const fakeB64 = Buffer.from('fake-image-data').toString('base64');
    mockImages.edit.mockResolvedValueOnce({
      data: [{ b64_json: fakeB64 }]
    } as any);

    const prompt = new ImagePrompt('This is an example!!! --width 512', {
      height: 512,
      name: 'test.png',
      type: 'image/png',
      img: Readable.from([Buffer.from('fake-image-data')])
    });

    const imgResponse = await ai.generateImage(prompt);

    expect(mockClient.images.edit).toHaveBeenCalledTimes(1);
    expect(mockClient.images.edit).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: prompt.getRawPrompt(),
        model: 'gpt-image-1-mini'
      })
    );
    expect(imgResponse).toBeDefined();
    expect(imgResponse.getImage()).toMatchObject({
      width: 512,
      height: 512,
      format: 'png'
    });
  });
});
