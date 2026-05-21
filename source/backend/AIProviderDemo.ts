import { IUniversalAIProvider, AIGenerator, ImagePrompt, ImageResponse, ImageData, ResponseMetadata} from "./core/UniversalAIProvider";


export class OpenAIProvider implements IUniversalAIProvider {

    key: string = "";
    constructor(key: string = "") {
        this.key = key;
    }

    public async generateImage(prompt: ImagePrompt): Promise<ImageResponse> {
        // OpenAI might use a JSON body API, so we extract specific properties from the Record
        // const promptText = prompt.getRawPrompt();
        const width = prompt.getArgument<number>("width") || 1024;
        const height = prompt.getArgument<number>("height") || 1024;
        const sizeString = `${width}x${height}`;
        
        console.log(`[xxAIProvider] Sending API Request: Prompt="${prompt.getRawPrompt()}", Size=${sizeString}`);
        // Call the API with key and argument
        // Mock network delay and response
        return new ImageResponse(
            new ImageData(new Uint8Array([/* mock data */]), "png", width, height),
            new ResponseMetadata(1200, "dall-e-3", "success")
        );
    }
}

export class StableDiffusionProvider implements IUniversalAIProvider {
    public async generateImage(prompt: ImagePrompt): Promise<ImageResponse> {
        // Stable Diffusion or Midjourney might prefer argc/argv or CLI execution
        const argv = prompt.getArgv();
        console.log(`[StableDiffusionProvider] Executing with args: [${argv.join(", ")}]`);
        
        // Mock network delay and response
        return new ImageResponse(
            new ImageData(new Uint8Array([/* mock data */]), "jpeg", 512, 512),
            new ResponseMetadata(3400, "sdxl-1.0", "success")
        );
    }
}

// ============================================================================
// Usage Example
// ============================================================================

async function runExample() {
    // 1. Create a prompt with dynamic, unknown parameters using the Record pattern
    const prompt = new ImagePrompt("This is an example!!! --ar 16:9 --stylize 100", {
        seed: 42,
        negative_prompt: "blurry, low quality"
    });

    // Parse inline parameters (--ar 16:9, etc.) into the dictionary
    prompt.parseRawPromptToArgs();

    // Easily swap this with `new StableDiffusionProvider()`
    const provider = new OpenAIProvider(); 
    
    // Initialize the Orchestrator
    const generator = new AIGenerator(provider);
    generator.setTimeout(45000);

    const response = await generator.execute(prompt);
    
    console.log("Metadata:", response.getMetadata());
}

runExample().catch(console.error);