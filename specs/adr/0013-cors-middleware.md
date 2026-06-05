# 0013. Use cors middleware to allow cross-origin requests

| Attribute | Value             |
| --------- | ----------------- |
| Date      | `2026-06-05`      |
| Status    | Proposed          |
| Deciders  | Backend team + TA |

## Context

The frontend is served as a static site (ADR 0002) and communicates with the Express backend (ADR 0003) via `fetch`. During local development the two origins differ — the frontend runs on one port while the Express server runs on another. Without an explicit CORS policy, browsers enforce the same-origin policy and block all cross-origin `fetch` calls, making the two layers unable to communicate.

Two approaches were considered:

1. **`cors` npm package** — mount the well-maintained `cors` middleware so Express adds the correct `Access-Control-Allow-*` response headers on every request.
2. **Manual headers** — write a small custom middleware that sets `res.setHeader('Access-Control-Allow-Origin', '*')` and related headers by hand.

## Decision

We will install **[cors](https://github.com/expressjs/cors)** as a production dependency and **`@types/cors`** as a dev dependency, and register it globally in `app.ts` before all other middleware:

```ts
import cors from 'cors';

app.use(cors());
```

This permits all origins with default settings. The policy can be tightened later by passing an options object (e.g. an `origin` allowlist) without touching any other code.

## Consequences

### Positives

- eliminates same-origin errors during local development immediately.
- `cors` is the standard Express CORS solution — actively maintained, zero transitive runtime dependencies, and widely understood by the team.
- centralised in one `app.use(cors())` call, making future policy changes (allowlist, credentials, specific methods) straightforward.
- `@types/cors` ships full TypeScript types so no type-casting is required in `app.ts`.

### Negatives/tradeoffs

- the default `cors()` configuration allows all origins (`*`), which is intentionally permissive. Before any production deployment the options must be tightened to an explicit allowlist.
- adds two packages (`cors` + `@types/cors`) to `package.json`; both must be kept up to date.

### Follow-up

- restrict the `origin` option to known frontend origins before public deployment.
- add `cors` to `package.json` dependencies and `@types/cors` to devDependencies (already done as of this ADR).
