# 0012. Adopt OpenAI Node.js SDK for AI Image Generation

| Attribute | Value             |
| --------- | ----------------- |
| Date      | `2026-05-29`      |
| Status    | Accepted          |
| Deciders  | Backend team + TA |

## Context

The backend needs to communicate with OpenAI's image generation API as first model to process images. Making raw HTTP requests to the API is verbose and requires manual handling of authentication, request formatting, and response parsing. Making our code more error prone and harder to understand.

## Decision

We will use the official **OpenAI Node.js SDK** (`openai`) to interact with OpenAI's image generation endpoints.

**Package**: `openai`

The client is initialised once per provider file and scoped to that file only:

```typescript
// services/providers/OpenAIProvider.ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: config.openAIKey });
```

## Consequences

### Positives

- **Type safety:** The SDK ships with full TypeScript types, reducing runtime errors and improving autocomplete.
- **Simpler code:** Authentication, retries, and request formatting are handled by the SDK rather than written by hand.
- **Scoped correctly:** Each provider owns its own client instance, keeping provider concerns isolated from the rest of the architecture.

### Negatives/Tradeoffs

- **Vendor dependency:** The SDK is maintained by OpenAI — breaking changes in the SDK require updates on our side.

### Follow-up

- Implement OpenAI SDK
