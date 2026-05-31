import { UUIDGenerator } from '../models/id-generator';
//import { FileRepository } from '../models/file-system';
//import { LocalDiskStorageStrategy } from '../models/file-storage';
import { FileRecord, type FileRepositoryOperator } from '../models/file-system';
import { NoStorageStrategy, type StorageStrategy } from '../models/file-storage';

class FakeRepository implements FileRepositoryOperator {
  saveFile(file: any, metadata: Partial<FileRecord>, strategy: StorageStrategy): FileRecord {
    // Returns fake FileRecord
    return new FileRecord(
      metadata.id || 'fake-id-123', 
      metadata.filename || 'template.jpg',
      `/mock/path/${metadata.filename}`,
      'image/jpeg',
      new Date(),
      {}
    );
  }

  getFileById(id: string): FileRecord | undefined { return undefined; }
  getFileStream(id: string, strategy: StorageStrategy): any { return undefined; }
}

const fileRepo = new FakeRepository();
const diskStrategy = new NoStorageStrategy();
//uncomment when FileSystem is finished
//const fileRepo = new FileRepository();
//const diskStrategy = new LocalDiskStorageStrategy();
const idGen = new UUIDGenerator();

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

// The Global Template Cache (array of templatedata objects)
export const templateCache: TemplateData[] = [];

export async function bootstrapTemplates() {
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const json = (await response.json()) as ImgflipResponse;
  
        if (json.success) {
        const memes = json.data.memes;
        
        for (const meme of memes) {
          const newTemplateId = idGen.generate();
          const imageRes = await fetch(meme.url);
          const arrayBuffer = await imageRes.arrayBuffer();
          const imageBuffer = Buffer.from(arrayBuffer);
          //using filerepo system to save img and metadata
          //const savedRecord = await fileRepo.saveFile(
          const savedRecord = fileRepo.saveFile(
            imageBuffer, 
            { 
              id: newTemplateId,    
              filename: meme.name 
            },
            diskStrategy     
          );
          //saving to cache
          templateCache.push({
            id: savedRecord.id, 
            name: meme.name,
            url: meme.url, 
            width: meme.width,
            height: meme.height
          });
        }
        console.log(`Successfully loaded ${templateCache.length} templates.`);
      }
    } catch (error) {
      console.error('Failed to load Imgflip templates:', error);
    }
}