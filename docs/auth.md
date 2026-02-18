Auth module

Purpose

- Describe authentication mechanism and where auth helpers live.

Conventions

- Token handling: Bearer token via `Authorization` header.
- Client-side token store: use `src/lib/auth` for helpers (get/set token, refresh, attach header).
- Environment variables: `NEXT_PUBLIC_API_BASE` for base URL; server-only secrets stored in `.env`.

Notes

- If implementing silent refresh, document flow here and add endpoints used for refresh.
