# Architecture Decision Records (ADRs)

An architecture decision record (ADR) is a document that captures an important architecture decision made along with its context and consequences.

This folder documents **why** we made important technical choices. It is written for teammates and course staff reviewing the project.

ADR file names must follow the format `NNNN-short-lowercase-title.md`.

## How to write a new ADR

1. Copy [`0000-template.md`](./0000-template.md) to the next number (e.g. `0001-use-x-library.md`).
2. Fill in every section. Keep ADRs concise yet easy to understand.
3. Set **Status** to `Proposed`, and then `Accepted` or `Rejected` once a decision has been made based off the legend below.
4. Open a PR/commit with a message that references the decision.

## Status legend

| Status   | Meaning                                     |
| -------- | ------------------------------------------- |
| Proposed | under discussion or pending review          |
| Accepted | received approval for implementation        |
| Rejected | did not receive approval for implementation |
