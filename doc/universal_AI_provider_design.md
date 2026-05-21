# Architecture Decision Record: Universal AI Provider Integration
### Bottom Line Up Front (BLUF)
We have adopted an Inversion of Control (IoC) architecture combined with a dynamic TypeScript configuration pattern to decouple our core execution logic from specific AI models. This design allows us to seamlessly swap AI providers and dynamically pass unknown or evolving model parameters without modifying our core interfaces, keeping our architecture extensible and future-proof.

### The Pain Points Addressed
For the project right now, I have run into a few critical blockers that this architecture directly resolves:
1. The "Black-Box" Parameter Problem: Different AI image generators require entirely different, frequently changing arguments. We didn't know exactly what parameters to hardcode, which risked making our classes brittle and constantly in need of updates.
2. Tight Coupling: Tying our generation logic directly to a specific AI's API meant that testing, mocking, or switching to a new model would require rewriting significant portions of the application.

### Key Architectural Benefits
- **Inversion of Control (IoC)**: The AIGenerator acts strictly as a robust orchestrator. By injecting the IUniversalAIProvider interface into its constructor rather than instantiating a concrete class, the generator manages common, cross-cutting concerns (like timeouts and retries) while remaining completely ignorant of the underlying AI implementation.

``` mermaid
---
title: Ad
---
classDiagram
    class IUniversalAIProvider {
        <<interface>>
        +generateImage(prompt: ImagePrompt) ImageResponse
    }

    class OpenAIProvider {
        +generateImage(prompt: ImagePrompt) ImageResponse
    }
    
    class StableDiffusionProvider {
        +generateImage(prompt: ImagePrompt) ImageResponse
    }

    class AIGenerator {
        -provider: IUniversalAIProvider
        -timeoutMs: number
        -maxRetries: number
        +constructor(provider: IUniversalAIProvider)
        +execute(prompt: ImagePrompt) ImageResponse
        +setTimeout(timeoutMs: number) void
    }

    class ImagePrompt {
        -rawPrompt: string
        -arguments: Record~string, any~
        +constructor(rawPrompt: string, args?: Record~string, any~)
        +setArgument(key: string, value: any) void
        +getArgument(key: string) any
        +parseRawPromptToArgs() void
        +getArgc() number
        +getArgv() string[]
    }

    class ImageResponse {
        -image: ImageData
        -metadata: ResponseMetadata
        +getImage() ImageData
        +getMetadata() ResponseMetadata
    }

    class ImageData {
        -payload: Uint8Array
        -format: string
        -width: number
        -height: number
    }

    class ResponseMetadata {
        -processingTimeMs: number
        -modelName: string
        -finishReason: string
    }

    IUniversalAIProvider <|.. OpenAIProvider : Implements
    IUniversalAIProvider <|.. StableDiffusionProvider : Implements
    
    AIGenerator o-- IUniversalAIProvider : DI （IoC)
    
    AIGenerator ..> ImagePrompt : Consumes
    AIGenerator ..> ImageResponse : Returns
    
    IUniversalAIProvider ..> ImagePrompt : Consumes
    IUniversalAIProvider ..> ImageResponse : Produces
    
    ImageResponse *-- ImageData : Composition
    ImageResponse *-- ResponseMetadata : Composition
```