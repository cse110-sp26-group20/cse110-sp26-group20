# Contributing Guide

This guide covers the basic workflow for building, running, and contributing to MemeLab

## Project structure

- `source/frontend/` - static frontend assets and pages
- `source/backend/` - Express + TypeScript backend API

## Setup

From the repository root, install dependencies once with:

```bash
npm install
```

## Frontend

The frontend is a static site under `source/frontend/`.

### Run locally

1. Open `source/frontend/` in VS Code.
2. Install and enable the **Live Server** extension.
3. Open `index.html` and use Live Server to preview the page.

> The Live Server extension provides a local web server for the frontend and is the recommended workflow for editing the static pages.

## Backend

The backend is in `source/backend/` and requires a `.env` file with an OpenAI API key.

### Configure environment

1. Copy `.env.example` to `.env`:

```bash
cp source/backend/.env.example source/backend/.env
```

2. Create your own OpenAI API key at:

https://platform.openai.com/api-keys

3. Open `source/backend/.env` and add the key next to `OPENAI_API_KEY`

### Run the backend

From `source/backend/`:

```bash
npm install
cd source/backend
npm run dev
```

## Linting and formatting

This repository uses ESLint and Prettier.

From the repository root, run:

```bash
npm run lint
npm run format
```

If you make changes under `source/`, run lint and format before submitting a PR.

## Contributing best practices

- Keep frontend changes in `source/frontend/`.
- Keep backend changes in `source/backend/`.
- Test your backend changes with `npm run dev` and any relevant API endpoints.
- Use clear commit messages and describe your changes in PRs.
