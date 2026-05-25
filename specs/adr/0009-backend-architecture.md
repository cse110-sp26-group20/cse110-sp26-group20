# 0008. Adopt Model-Route-Controller Architecture for Backend

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-24`                         |
| Status    | Pending                              |
| Deciders  |                                      |

## Context

The backend serves as the bridge between the frontend and multiple AI image generation providers (e.g. OpenAI, Stable Diffusion, Claude). Without a database, we still need a clear, scalable structure to organise request handling, business logic, and data shapes as the number of things our backend supports.

## Decision

We will adopt a layered **Model-Route-Controller** architecture, extended with a **Services** layer to replace the role a database layer would otherwise play.

More details about what purpose each folder serves: [model-route-controller.md](https://github.com/cse110-sp26-group20/cse110-sp26-group20/blob/main/artifacts/model-route-controller.md)


## Consequences

### Positives

- **Clear separation of concerns:** Each layer has a single, obvious responsibility — easy to navigate and extend.
- **No circular imports:** Dependencies flow strictly downward (`routes → controllers → services → models`). 
- **Testable in isolation:** Services and models can be unit tested independently of HTTP concerns.

### Negatives/Tradeoffs

- **More files than a flat structure:** A simple project could live in fewer files. The layering adds overhead that only pays off as the codebase grows.

### Follow-up

- Documentation at `/artifacts/model-route-controller.md`