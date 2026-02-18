Docs index — Module-wise documentation

This `docs/` folder contains module-specific READMEs. Before editing or performing actions on files in a module, every agent MUST read the corresponding module README.

Structure

- docs/
  - README.md # this file
  - api.md # API client generation, spec location, conventions
  - hooks.md # react-query wrapper conventions, hook patterns
  - ui.md # Ant Design usage, component guidelines
  - auth.md # auth flow, environment variables, token handling
  - components.md # component architecture and naming conventions

Rules for agents

- Read the relevant module README before making edits to that module.
- Document any design or API decisions in the module README.
- Keep READMEs concise and focused on conventions, entry points, and pointers to files.
