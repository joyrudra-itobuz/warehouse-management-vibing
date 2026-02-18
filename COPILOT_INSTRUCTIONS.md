Project folder structure and strict architecture rules

This file documents the canonical folder structure for the application.
Agents should treat this file as the single source of truth and must follow it strictly.

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
  - components/
  - hooks/
  - lib/
    - apis/
      - swagger/ # all currently available APIs with their types
      - routes/ # all API routes
  - services/ # business logic and service layer (optional)
  - styles/ # global styles and tokens
- docs/ # module-wise documentation (read before editing modules)

Non-negotiable rules

- Everything in this project must be modularized with separation of concerns.
- Components must be broken down as far as reasonably possible.
- Repeated templates must always be extracted into reusable components.
- Each component must have context in its folder path.
- No file may contain more than one component.
- This same strict structuring rule applies everywhere: components, hooks, utils, types, services, and API modules.

Component folder conventions

- Auth common component example:
  - `src/components/auth/common/[component-folder-name]/[component-file-name].tsx`
- Auth sign-up specific component example:
  - `src/components/auth/sign-up/sign-up-button/sign-up-button.tsx`
- Global shared components should live under a clearly scoped path in `src/components` using the same one-component-per-file rule.

Notes for agents

- Always consult the corresponding file under `docs/` before modifying a module.
- The app uses Bun as package manager and Ant Design as the primary UI library (see `docs/ui.md`).
- API type definitions and contracts should come from `src/lib/apis/swagger`.
- API endpoint route definitions should live in `src/lib/apis/routes`.
