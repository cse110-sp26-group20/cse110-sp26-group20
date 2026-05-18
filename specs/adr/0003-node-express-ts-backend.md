# 0003. Use Node.js, Express, and TypeScript for the backend

| Attribute | Value        |
| --------- | ------------ |
| Date      | `2026-05-14` |
| Status    | Accepted     |
| Deciders  | Team + TA    |

## Context

Our backend subteam needs a server that can proxy third-party APIs (such as Imgflip or AI image generation APIs) and expose REST endpoints for the vanilla frontend while being easy for course staff to install and run. Our May 14 standup proposed Node.js with Express. It is required that libraries are listed and approved via ADR.

TypeScript gives shared types for request/response shapes between routes and makes refactors safer as the API grows.

## Decision

We will implement the backend under `source/backend/` using:

- **Node.js** as the runtime
- **Express** as the HTTP server and routing layer
- **TypeScript** as the source language, ran via `tsx` in development

Dependencies for the initial skeleton:

| Package          | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `dotenv`         | Load environment secrets from `.env` in development        |
| `express`        | HTTP server and routing                                    |
| `typescript`     | Type checking and build output                             |
| `tsx`            | Run TypeScript in development                              |
| `tsc-alias`      | TypeScript alias replacement utility for production builds |
| `@types/express` | TypeScript types for `express` package                     |
| `@types/node`    | TypeScript types for Node.js                               |

We will not add ORMs, auth providers, or image-processing servers in the MVP without a new ADR. Environment variables will live in `.env` with keys documented in `.env.example`.

## Consequences

### Positives

- Familiar stack for much of the backend subteam; strong TA and course alignment.
- TypeScript catches API contract mistakes before runtime.
- Express is minimal and easy to document for `npm install` / `npm run dev`.

### Negatives/tradeoffs

- TypeScript adds a compile or `tsx` step compared to plain JavaScript.

### Follow-up

- Scaffold initial backend structure
