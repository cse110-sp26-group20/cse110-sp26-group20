import {
  NoStorageStrategy,
  type StorageStrategy
} from '../models/file-storage';
import { type FileRepositoryOperator } from '../models/file-system';

// format we will send to the frontend
export interface TemplateData {
  id: string; //will be the generated UUID
  name: string;
  url: string;
  width: number;
  height: number;
}

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

interface ImgflipResponse {
  success: boolean;
  data: {
    memes: ImgflipMeme[];
  };
}

export class TemplateService {
  public templateCache: TemplateData[] = [];

  private fileRepo: FileRepositoryOperator;
  private diskStrategy: StorageStrategy;

  constructor(realFileRepo: FileRepositoryOperator, strategy: StorageStrategy) {
    this.fileRepo = realFileRepo;
    this.diskStrategy = strategy;
  }

  public async bootstrapTemplates() {
    this.templateCache.length = 0;

    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const json = (await response.json()) as ImgflipResponse;

      if (json.success) {
        const memes = json.data.memes;

        for (const meme of memes) {
          //determines if we download the image or fake it
          const imageBuffer =
            this.diskStrategy instanceof NoStorageStrategy
              ? Buffer.alloc(0)
              : Buffer.from(await (await fetch(meme.url)).arrayBuffer());

          const savedRecord = this.fileRepo.saveFile(
            imageBuffer,
            {
              filename: meme.name,
              type: 'image/jpeg'
            },
            this.diskStrategy
          );

          this.templateCache.push({
            id: savedRecord.id,
            name: meme.name,
            url: meme.url,
            width: meme.width,
            height: meme.height
          });
        }
        console.log(
          `Successfully loaded ${this.templateCache.length} templates.`
        );
      }
    } catch (error) {
      console.error('Failed to load Imgflip templates:', error);
    }
  }
}
