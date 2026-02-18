API module

Purpose

- Location for instructions about the API client, OpenAPI spec, and generation steps.

Conventions

- Generated client location: `src/lib/api`.
- Types: generate TypeScript types from OpenAPI spec and commit to repo.
- Auth: use Bearer token in `Authorization` header. See `auth.md` for token storage.

Placeholder steps

1. Place OpenAPI spec at `specs/openapi.yaml` (or provide externally).
2. Generate client (tool of choice) into `src/lib/api`.
3. Create thin adapter `src/lib/api/client.ts` to set base URL and headers.
