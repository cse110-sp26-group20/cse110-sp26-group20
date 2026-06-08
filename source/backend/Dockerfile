# --- build stage ---
FROM node:24-alpine AS builder
WORKDIR /app

# copy workspace manifests so npm ci can resolve the workspace
COPY package.json package-lock.json ./
COPY source/backend/package.json ./source/backend/

RUN npm ci

COPY source/backend/ ./source/backend/

WORKDIR /app/source/backend
RUN npm run build

# --- production stage ---
FROM node:24-alpine AS production
WORKDIR /app

COPY package.json package-lock.json ./
COPY source/backend/package.json ./source/backend/

RUN npm ci --omit=dev

COPY --from=builder /app/source/backend/dist ./source/backend/dist

RUN mkdir -p ./source/backend/uploads

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/source/backend
CMD ["node", "dist/server.js"]
