# 0011. Use multer to handle multipart/form-data file uploads

| Attribute | Value             |
| --------- | ----------------- |
| Date      | `2026-05-27`      |
| Status    | Proposed          |
| Deciders  | Backend team + TA |

## Context

Issue [#39](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/39) requires the backend (TypeScript + Express) to accept image uploads via `multipart/form-data` HTTP requests. The discussion in issue [#52](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/52) identified two candidate approaches:

1. **Third-party library (multer / formidable)** — use a battle-tested middleware that parses the `multipart/form-data` stream, validates MIME types, enforces size limits, and writes the temporary file to disk.
2. **Manual raw-stream parsing** — intercept the raw `IncomingMessage` stream, read the `Content-Type` boundary from the HTTP headers, and implement a custom state machine to extract binary payloads without any external dependencies.

The project already uses Express middleware conventions (ADR 0003) and has an established pattern of pulling in well-scoped npm packages (e.g., `uuid`, ESLint, Jest) when they meaningfully reduce implementation risk. Correctly parsing a binary multipart stream by hand is error-prone, and any bug in boundary detection or buffer handling could result in corrupted files or out-of-memory crashes.

## Decision

We will use **[multer](https://github.com/expressjs/multer)** as Express middleware to parse incoming `multipart/form-data` requests. multer will be configured with `memoryStorage` so the uploaded file is held as a `Buffer` on `req.file.buffer` without touching disk. The controller then passes that buffer to `FileRepository.saveFile()`, which routes it through the injected `IDGenerator` and `StorageStrategy` as designed in ADR 0008 — keeping disk I/O inside the established abstraction layer.

```ts
import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});
```

The upload flow becomes:

```
multipart/form-data request
  → multer (memoryStorage) → req.file.buffer
  → controller calls FileRepository.saveFile(buffer, metadata)
  → FileRepository calls IDGenerator.generate() for the unique ID
  → FileRepository calls StorageStrategy.write(id, buffer) to persist to disk
  → FileRecord is registered in the in-memory map
```

The `uploads/` directory is then served as a static route via `express.static` so stored files are accessible over HTTP.

## Consequences

### Positives

- multer is the de-facto standard for Express file uploads — actively maintained, well-documented, and covers all multipart edge cases.
- built-in support for file-size limits, MIME-type filtering, and field validation protects against malformed or oversized uploads without any custom code.
- `memoryStorage` keeps multer's role strictly as a parser — disk I/O stays inside `StorageStrategy`, preserving the abstraction from ADR 0008.
- `FileRepository` / `IDGenerator` / `StorageStrategy` remain the single source of truth for how files are named, stored, and tracked; nothing bypasses the in-memory map.
- surface area is small — the dependency adds one package with no transitive dependencies beyond what Node already provides.

### Negatives/tradeoffs

- introduces a third-party dependency; multer must be kept up to date to avoid known CVEs.
- `memoryStorage` buffers the entire file in RAM before handing it to `StorageStrategy`; for very large files this increases peak memory use. The 10 MB limit mitigates this at the current project scale.
- multer does not validate image content beyond MIME type; a follow-up file-type check (e.g., inspecting magic bytes) may be needed for stricter security.

### Follow-up

- add `multer` and `@types/multer` to `package.json`.
- configure the `uploads/` directory as a static route (`express.static`) per issue [#40](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/40).
- register the upload middleware on the POST `/api/upload` route defined in issue [#39](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/39).
- close issue [#52](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/52) and link this ADR once it is accepted by TAs.
