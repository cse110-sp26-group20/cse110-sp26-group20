# 0006. Universal AI Provider Integration

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-21`                         |
| Status    | Accepted                             |
| Deciders  | Team                                 |

## Context

For the project right now, I have run into a few critical blockers that this architecture directly resolves:

- The "Black-Box" Parameter Problem: Different AI image generators require entirely different, frequently changing arguments. We didn't know exactly what parameters to hardcode, which risked making our classes brittle and constantly in need of updates.
- Tight Coupling: Tying our generation logic directly to a specific AI's API meant that testing, mocking, or switching to a new model would require rewriting significant portions of the application.

## Decision

We will invoke the idea of Inversion of Control (IoC) to address the problem. We decided to inject the implementation of AI via AIGenerator, which acts strictly as a robust orchestrator. 

More details: [universal_AI_provider_design.md](https://github.com/cse110-sp26-group20/cse110-sp26-group20/blob/main/artifacts/universal_AI_provider_design.md)

## Consequences

### Positives

By injecting the IUniversalAIProvider interface into its constructor rather than instantiating a concrete class, the generator manages common, cross-cutting concerns (like timeouts and retries) while remaining completely ignorant of the underlying AI implementation.

### Negatives/tradeoffs

It will cause the AIGenerator to complex. Need some time to understand. 

### Follow-up

- Document at `/artifacts/universal_AI_provider_design.md`
- Code: `/source/backend/core/UniversalAIProvider.ts`
- Example `/source/backend/AIProviderDemo.ts`
