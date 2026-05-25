# Backend Architecture

```
src/
├── routes/          # URL definitions
├── controllers/     # HTTP request/response handling
├── services/        # Business logic
│   └── providers/   # Concrete AI provider implementations
├── models/          # TypeScript types and interfaces
├── app.ts           # Express setup, middleware, error handling
└── server.ts        # Entry point
```

### Folder Responsibilities

**`models/`** — Describes the shape of data. No logic, no I/O. If you're defining what something *looks like*, it goes here.

**`services/`** — Where work happens. Orchestrates logic, calls providers, handles retries. No knowledge of HTTP.

**`services/providers/`** — One file per AI provider. Each implements `IUniversalAIProvider`, making them interchangeable.

**`controllers/`** — Handles HTTP request and response. Unpacks the request, validates inputs, calls a service, sends the response. Nothing else.

**`routes/`** — Maps a URL and HTTP method to a controller function. No logic.

---

## Designing an Endpoint

Follow this pattern for every new endpoint:

**1. Define your data shapes in `models/`**

**2. Implement the logic in `services/`**

**3. Handle HTTP in `controllers/`**

**4. Register the route in `routes/`**

**5. Mount in `app.ts`**
```typescript
app.use('/api/ai', aiRoutes)
```

---

## Adding a New AI Provider

1. Create a file in `services/providers/`
2. Implement `IUniversalAIProvider`
3. That's it — no other files need to change
