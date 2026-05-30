import type { Request, Response } from 'express';

import { ImagePrompt } from '../models/image-prompt';
import { AIGenerator } from '../services/ai-generator';
import { OpenAIProvider } from '../services/providers/openai-provider';

export async function generateResponse(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imagePrompt = new ImagePrompt(prompt);
    imagePrompt.parseRawPromptToArgs();

    const aiGenerator = new AIGenerator(new OpenAIProvider());
    const response = await aiGenerator.execute(imagePrompt);

    // before sending the response, update the image buffer array to something the frontend can handle, such as a base64 string
    res.status(200).json({
      image: Buffer.from(response.getImage().payload).toString('base64'), // ← convert here
      format: response.getImage().format,
      width: response.getImage().width,
      height: response.getImage().height,
      metadata: response.getMetadata()
    });
  } catch (error) {
    console.error('Failed to generate AI response', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
}
