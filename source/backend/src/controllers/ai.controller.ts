import type { Request, Response } from 'express';

import { ImagePrompt } from '../models/image-prompt';
import { ImagePrompt } from '../models/image-prompt';
import type { IUniversalAIProvider } from '../models/universal-ai-provider';
import type { FileRecord, FileRepositoryOperator } from '../models/file-system';
import type { StorageStrategy } from '../models/file-storage';
import { Readable } from 'stream';

export class AIController{
  // Use Dependency Injection for UniversalAI instead of the actual implementation.
  constructor(
    private readonly aiGenerator: IUniversalAIProvider
    ,private readonly fileRepo:FileRepositoryOperator
    ,private readonly strategy:StorageStrategy
  ){}
  generateResponse = async (req: Request, res: Response) =>{
    try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imagePrompt = new ImagePrompt(prompt);
    imagePrompt.parseRawPromptToArgs();
    const response = await this.aiGenerator.generateImage(imagePrompt);
    const file:Partial<FileRecord> = {};
    if(response && response.getImage()){
      const img = response.getImage();
      file.type = img.format;
      file.matedata = {'img':img};
      const fileResult = this.fileRepo.saveFile(Readable.from(img.payload),file,this.strategy);
      file.id = fileResult.id;
      file.localPath = fileResult.localPath;
    }

    // before sending the response, update the image buffer array to something the frontend can handle, such as a base64 string
    res.status(200).json({
      id:file.id,
      url: file.localPath || await this.strategy.resolvePath(file.id || ''),
      // image: Buffer.from(response.getImage().payload).toString('base64'), // ← convert here
      // format: response.getImage().format,
      // width: response.getImage().width,
      // height: response.getImage().height,
      // metadata: response.getMetadata()
    });
    } catch (error) {
      console.error('Failed to generate AI response', error);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  }
}