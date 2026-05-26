# 0008. Use Unified Unique IDs for Global File Management

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-23`                         |
| Status    | Accepted                             |
| Deciders  | Team                                 |

## Context
Our application requires image handling that spans multiple distinct features: `file uploads`, a `template library` (populated from the Imgflip API during startup), and an `editor`. Because we are building a lightweight Express-TS application without a relational database, we need a simple, unified, and highly performant way to manage and retrieve these files.

The Editor feature, in particular, does not care whether an image was uploaded by a user or fetched as a template. It only needs to locate the local file path and stream it to the client. We need a strategy to decouple the origin of the file from how it is queried and served.

## Decision
We will use a universally unique identifier (ID) as the single source of truth and primary key to track, store, and serve all files across the system.

All **IMG file** will be assigned a unique ID (e.g., UUIDv4) upon creation. This ID will serve as the key in a centralized **FileRepository** (an in-memory map *[backed by a local JSON registry]*), mapping directly to the file's local system path and metadata.

More details see: 
- `/artifacts/file-system-design.md`
- `/artifacts/file-repository-design.md`

## Consequences
### Positives
- By decoupling `FileRepository`, we could **skip local JSON registry** feature for our first version, focus on memory read and write first.
- API Simplicity: The Editor and frontend only need to know a single ID to fetch any image (e.g., GET /images/:id), completely abstracting away the underlying file paths and origins.
- Lightweight: Since we store data in memory, avoids the overhead of a full database or complex relational schemas while maintaining a reliable mapping of files.
- Uniformity: Standardizes the serialization and retrieval process for both the Template Library and user uploads.

### Negatives/tradeoffs
- Memory Constraints: Since all file IDs and metadata are stored in an in-memory map, the system's capacity is tied to available RAM. (Acceptable given the small scale of the project).
- ID Collision Risk: We must ensure strict uniqueness when generating IDs across different ingestion flows (load from IMGFlip vs. concurrent user uploads).
- Orphaned Files: If the in-memory map or JSON registry loses an ID, the associated file on disk becomes unreferenced and inaccessible.

## Follow-up
- Implement a reliable UUID generator utility.
- Build the FileRepository class to handle the memory-to-disk persistence of the ID -> Path mappings.
- Update the bootstrapping script to ensure Imgflip API images are assigned unique IDs before being saved to the local file system.