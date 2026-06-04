import { Readable } from 'stream';

import { ImagePrompt } from '../models/image-prompt';
// import { ImageResponse } from '../models/image-response';
import { type IUniversalAIProvider } from '../models/universal-ai-provider';
import { OpenAIProvider } from '../services/openai-provider';

/**
 * TODO: Test the ai provider first.
 * Focus on the provider don't care about file-repository or others.
 */
describe('Open AI Generator', () => {
  let ai: IUniversalAIProvider;
  beforeAll(() => {
    ai = new OpenAIProvider();
  });
  test('generate() with prompt', async () => {
    const prompt = new ImagePrompt('This is an example!!! --width 512', {
      height: 512,
      img: Readable.from([]) // TODO: test with a real file
    });
    const imgResponse = await ai.generateImage(prompt);
    // TODO: check the result
    expect(imgResponse).toBeDefined();
  });
});
