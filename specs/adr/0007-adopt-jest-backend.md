# 0007. Adopt Jest and GitHub Actions for Backend Unit Testing

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-22`                         |
| Status    | Proposed                             |
| Deciders  | Backend Team + TA                    |

## Context

Manual testing of backend APIs is error-prone and cannot prevent regressions. We need an automated testing pipeline to verify code quality before merging.

## Decision

We will adopt **Jest** alongside **`ts-jest`** for writing and executing backend unit tests. We will also implement a **GitHub Actions CI workflow** that automatically runs `npm ci` and `npm test` on all Pull Requests targeting the `main` branch where backend files are modified.

## Consequences

### Positives

- **Automated Quality Gate:** Bugs are caught early by CI before they can be merged into the `main` branch.
- **Clean Separation:** Backend testing is isolated from frontend concerns, keeping the backend dependency tree lightweight.

### Negatives/tradeoffs

- **Configuration Complexity:** Requires careful alignment of `tsconfig.json` and Jest configurations to support our ESM setup.

### Follow-up

- Write the initial unit tests for the `Storage Utility` (Image Upload feature).
- Document testing guidelines and commands (e.g., `npm test`, `npm run test:watch`) in the backend `README.md`.