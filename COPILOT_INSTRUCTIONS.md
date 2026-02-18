Project folder structure

This file documents the canonical folder structure for the application. Agents should use this as the single-source-of-truth for where modules live.

/

- package.json
- bun.lockb
- next.config.ts
- tsconfig.json
- public/
- src/
  - app/
    - globals.css
    - layout.tsx
    - page.tsx
  - components/ # shared React components (presentational & composite)
  - hooks/ # react-query wrapper hooks and domain hooks
  - lib/ # low-level utilities, API client, query client
  - services/ # business logic and service layer (optional)
  - styles/ # global styles, tokens
- docs/ # module-wise documentation (read before editing modules)

Notes for agents

- Always consult the `docs/` entry for a module before modifying its files.
- The app uses Bun as package manager and Ant Design as the primary UI library (see docs/ui.md).
- API client code should live under `src/lib/api` and hooks under `src/hooks`.
