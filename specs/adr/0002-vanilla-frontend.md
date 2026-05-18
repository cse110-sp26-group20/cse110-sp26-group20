# 0002. Use vanilla HTML, CSS, and JavaScript on the frontend

| Attribute | Value        |
| --------- | ------------ |
| Date      | `2026-05-14` |
| Status    | Accepted     |
| Deciders  | Team + TA    |

## Context

CSE 110 expects our team project to use **vanilla web technologies** on the frontend (not a SPA framework or meta-framework). TA Omair requires that any libraries we add be justified in an ADR and approved before use.

Our frontend subteam needs a stack every member can contribute to without learning a framework build pipeline. The MVP includes a template gallery, image upload, a meme editor with Imgflip-like text controls, and client-side rendering of the final image.

## Decision

We will build the frontend with **plain HTML, CSS, and JavaScript only** under `source/frontend/`. We will **not** adopt React, Vue, Angular, Svelte, Next.js, Nuxt, or any other UI framework or component library for this project because that conflicts with the requirement for vanilla web tech.

Permitted without a new ADR: browser APIs (DOM, Canvas 2D, `fetch`, File API), standard ES modules if served without a bundler, and minimal static assets. If we later need a small utility (e.g. a single-purpose helper), we must justify it in a new ADR and obtain TA approval before adding it as a dependency.

## Consequences

### Positives

- Aligns with course expectations and TA approval path.
- Low setup cost: no bundler or framework toolchain required for graders.
- All frontend contributors work in the same skill surface (HTML/CSS/JS).

### Negatives/tradeoffs

- More manual DOM and state management as the editor grows.
- No ecosystem of prebuilt accessible components; we own layout and UX polish.

### Follow-up

- Keep frontend well documented in `source/frontend/README.md`.
