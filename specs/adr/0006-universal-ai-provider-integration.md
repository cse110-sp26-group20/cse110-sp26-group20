# 0006. Universal AI Provider Integration

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-21`                         |
| Status    | Proposed                             |
| Deciders  | Team |

## Context

For the project right now, I have run into a few critical blockers that this architecture directly resolves:

- The "Black-Box" Parameter Problem: Different AI image generators require entirely different, frequently changing arguments. We didn't know exactly what parameters to hardcode, which risked making our classes brittle and constantly in need of updates.
- Tight Coupling: Tying our generation logic directly to a specific AI's API meant that testing, mocking, or switching to a new model would require rewriting significant portions of the application.

## Decision

We will invoke Inversion of Control (IoC) for the AIGenerator acts strictly as a robust orchestrator. 

## Consequences

### Positives

By injecting the IUniversalAIProvider interface into its constructor rather than instantiating a concrete class, the generator manages common, cross-cutting concerns (like timeouts and retries) while remaining completely ignorant of the underlying AI implementation.

### Negatives/tradeoffs

I will cause the AIGenerator to complex. Need some time to understand. 

### Follow-up

- Document at `/artifacts/universal_AI_provider_design.md`
- Code: `/source/backend/core/UniversalAIProvider.ts`
- Example `/source/backend/AIProviderDemo.ts`
