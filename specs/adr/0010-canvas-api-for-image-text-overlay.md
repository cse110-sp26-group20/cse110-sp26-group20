# 0010. Use Canvas API for client-side image text overlay

| Attribute | Value         |
| --------- | ------------- |
| Date      | `2026-05-25`  |
| Status    | Proposed      |
| Deciders  | Frontend team |

## Context

Issue [#50](https://github.com/cse110-sp26-group20/cse110-sp26-group20/issues/50) requires the ability to render user-provided text on top of a meme template image as part of the editor feature. Two candidate approaches were considered:

1. **Backend image processing** — send the image and text to the Node/Express backend and use a library such as `sharp` or `jimp` to composite the text, then return the result.
2. **Frontend Canvas API** — draw text directly on a `<canvas>` element in the browser using the built-in [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text), with no additional libraries or server round-trip required.

The project is already constrained to vanilla HTML/CSS/JS on the frontend (ADR 0002), and the Canvas 2D API is a first-class browser built-in that requires no extra dependencies. Imgflip, the reference meme platform we integrate with, uses the same client-side canvas approach.

## Decision

We will use the **browser Canvas API** to render text overlays on meme images entirely on the frontend. The editor will draw the template image onto a `<canvas>` element and use `fillText` / `strokeText` to composite captions with configurable font, size, and color. No backend endpoint will be created for text-on-image rendering.

## Consequences

### Positives

- no additional npm packages or backend changes needed — zero new dependencies.
- eliminates a network round-trip for every text update, keeping the editor feel instant and responsive.
- aligns with ADR 0002 (vanilla frontend) — the Canvas 2D API is an approved browser built-in.
- the final composited image can be exported client-side via `canvas.toDataURL()` or `canvas.toBlob()` without server involvement.
- consistent with how Imgflip handles text overlay, reducing design uncertainty.

### Negatives/tradeoffs

- canvas rendering is purely visual; the exported image is a flat raster — text is not independently editable after export.
- cross-origin template images (e.g. fetched directly from Imgflip CDN URLs) will taint the canvas and block `toDataURL()` export unless the images are proxied through the backend or cached locally first. Images already downloaded and served from our own backend (as planned in the file system ADR) avoid this issue.
- font rendering varies slightly across browsers and operating systems.

### Follow-up

- close or link this ADR in GitHub issue #50 once accepted.
