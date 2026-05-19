# cse110-sp26-group20

This is the source-of-truth repository for CSE 110 Spring 2026 Group 20. It also serves as the landing page for our project and will be updated as we add code, tests, documentation and other important artifacts.

We follow automated code standards: Prettier for formatting and ESLint for linting on all code under `source/`. See [ADR 0004](./specs/adr/0004-eslint-prettier-lint-format.md) and the [linting section](#linting-and-formatting) for more information.

## Quick Links

- [Team Page](./admin/team.md)
- [Weekly Plans](./admin/plans/)
- [Meeting Notes](./admin/meetings/)
- [Architecture Decision Records](./specs/adr/)

## Repository Structure

- `/admin` - Internal documentation, team roster, meeting minutes, branding, plans, and intro video.
- `/source` - Source code for the application.
- `/specs` - Project specifications and requirements.

## Linting and formatting

We use [ESLint](https://eslint.org/) to catch code issues and [Prettier](https://prettier.io/) to keep formatting consistent. ESLint handles lint rules, and Prettier handles style (quotes, line breaks, import order).

These tools apply to **application code under `source/`** only (`source/backend/`, `source/frontend/`). They do not run on `admin/` or `specs/`. See [ADR 0004](./specs/adr/0004-eslint-prettier-lint-format.md).

### Setup

Install once from the **repository root** (npm workspaces hoist shared dev dependencies):

```bash
npm install
```

### Commands (from repository root)

| Command                | Action                                       |
| :--------------------- | :------------------------------------------- |
| `npm run lint`         | Lint frontend and backend                    |
| `npm run lint:fix`     | Lint and auto-fix where possible             |
| `npm run format:check` | Fail if source is not formatted (used by CI) |
| `npm run format`       | Format all workspace source code             |

### Before opening a PR

If you changed anything under `source/`, please run this from the repository root:

```bash
npm run lint:fix && npm run format
```
