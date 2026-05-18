# 0001. Deliver web app before iMessage integration

| Attribute | Value        |
| --------- | ------------ |
| Date      | `2026-05-14` |
| Status    | Accepted     |
| Deciders  | Team + TA    |

## Context

We originally explored an iMessage-style experience utilizing Apple's iMessage extension API and a webview, but building on Apple's messaging stack adds platform constraints, tooling overhead, and approval risk early in the project. Our team discussed pivoting to a regular web app if iMessage proved too difficult and later confirmed that we will start with a frontend and backend web application and handle iMessage later.

## Decision

We will ship the product as a **browser-based web application** with a separate frontend and backend for the full project timeline covered by this course. **iMessage integration is deferred** until core editor functionality (templates, text overlaying, exports) work end-to-end in the browser. Any future iMessage work requires a new ADR and explicit TA approval before adding platform-specific dependencies.

## Consequences

### Positives

- Faster path to a demoable MVP and sprint deliverables.
- Frontend and backend subteams can work against clear boundaries.
- TAs and graders can run the app with standard Node and a browser (no Xcode or Messages extension setup required for routine development)

### Negatives/tradeoffs

- We may not satisfy an iMessage-specific vision in the first sprints.
- A later iMessage spike could require a separate codebase or bridge and another round of TA review.

### Follow-up

- Track iMessage as a future task on the project board.
- Revisit scope with TA Omair before starting any Apple or Messages-specific implementation.
