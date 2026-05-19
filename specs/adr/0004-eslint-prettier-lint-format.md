# 0004. Use ESLint and Prettier for linting and formatting

| Attribute | Value        |
| --------- | ------------ |
| Date      | `2026-05-19` |
| Status    | Proposed     |
| Deciders  | Team + TA    |

## Context

As `source/backend/` and `source/frontend/` grow, we need automated checks so style and common mistakes are caught before review and in CI. Hand-review alone does not scale and leads to inconsistent formatting across contributors.

Our stack is already split into npm workspaces for backend (TypeScript + Express) and frontend (vanilla HTML/CSS/JavaScript per [0002](./0002-vanilla-frontend.md)), so lint and format tooling should work across both packages without duplicating dependencies.

We considered relying on editor settings alone; that is not enforceable in CI and varies by machine. We will standardize on industry-common tools with clear CLI commands and a GitHub Actions workflow.

## Decision

We will use **ESLint** for linting and **Prettier** for formatting across the project's application code.

**ESLint** enforces code quality and correctness rules (unused variables, problematic patterns, TypeScript-aware checks on the backend, browser-appropriate rules on the frontend). **Prettier** enforces consistent formatting (quotes, line wrapping, etc.). **`eslint-config-prettier`** disables ESLint rules that conflict with Prettier so the two tools do not fight each other.

New dev dependencies (installed at the repository root, consumed by workspaces):

| Package                               | Purpose                                             |
| ------------------------------------- | --------------------------------------------------- |
| `eslint`                              | Core linter                                         |
| `@eslint/js`                          | Recommended baseline rules                          |
| `typescript-eslint`                   | TypeScript linting for the backend                  |
| `globals`                             | Browser environment globals for frontend JavaScript |
| `eslint-config-prettier`              | Turn off formatting rules handled by Prettier       |
| `prettier`                            | Code formatter                                      |
| `@ianvs/prettier-plugin-sort-imports` | Stable import order in JS/TS files                  |

**How we run it**

- Root `package.json` defines npm workspaces for `source/backend` and `source/frontend` and hoists the packages above.
- Each workspace exposes `lint`, `lint:fix`, `format`, and `format:check` scripts (`eslint .` and `prettier .` / `prettier --check .`).
- Root scripts delegate to workspaces: `npm run lint`, `npm run format:check`, etc.
- Shared config: root `prettier.config.js`; per-workspace `eslint.config.js` tuned for TypeScript (backend) and browser JavaScript (frontend).
- **CI:** `.github/workflows/lint-format.yml` runs `npm ci`, then `npm run lint` and `npm run format:check` on relevant pushes and pull requests.

**Where it applies**

Linting and formatting with ESLint and Prettier apply to **application source under `source/`** (`source/backend/`, `source/frontend/`). We are not adopting these tools repo-wide: paths such as `admin/` (meeting notes, plans, assets) and `specs/` (ADRs, requirements) remain outside automated format checks to avoid noisy bulk diffs on documentation. Contributors may still format those files manually if they choose.

## Consequences

### Positives

- One clear standard: ESLint for lint, Prettier for format. This is easy to document and run locally (`npm run lint`, `npm run format:check`).
- CI enforces the same commands as local development.
- Shared root dependencies and config reduce duplication between backend and frontend.
- Prettier eliminates style debates in review. ESLint catches issues Prettier does not.

### Negatives/tradeoffs

- Extra dev dependencies and a small learning curve for teammates new to ESLint/Prettier.
- Documentation under `admin/` and `specs/` is not automatically formatted; style there may vary.
- New packages under `source/` must be added to workspaces and include lint/format scripts to stay covered.

### Follow-up

- Set ADR status to `Accepted` after approval
- Document commands in `source/backend/README.md` and `source/frontend/README.md` (install from repo root: `npm install`)
- Run an initial `npm run format` / `npm run lint:fix` on existing source so CI stays green
- Create a new ADR if we add ESLint/Prettier plugins or change scope
