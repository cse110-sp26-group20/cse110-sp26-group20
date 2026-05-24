import { OpenAIProvider, StableDiffusionProvider } from '../AIProviderDemo';
import { ImagePrompt } from '../models/ImagePrompt';
import { AIGenerator } from '../services/AIGenerator';

describe('Universal AI Provider', () => {
  it('should return a correct result from OpenAIProvider demo', async () => {
    const prompt = new ImagePrompt('This is an example!!! --width 512', {
      height: 512
    });
    prompt.parseRawPromptToArgs();
    const provider = new OpenAIProvider();
    const generator = new AIGenerator(provider);
    const result = await generator.execute(prompt);
    expect(result.getImage().width).toBe(512);
    expect(result.getImage().height).toBe(512);
  });

  it('should return a correct result from StableDiffusionProvider demo', async () => {
    const prompt = new ImagePrompt('This is an example!!!');
    const provider = new StableDiffusionProvider();
    const generator = new AIGenerator(provider);
    const result = await generator.execute(prompt);
    expect(result.getImage().width).toBe(512);
    expect(result.getImage().height).toBe(512);
  });
});
