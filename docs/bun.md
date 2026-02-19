Bun (package manager + runtime)

Purpose

- This project uses Bun as the primary package manager and local runtime for speed and consistency.

Quick commands

- Install dependencies:

```bash
bun install
```

- Start dev server (runs the `dev` script from `package.json`):

```bash
bun run dev
```

- Build for production:

```bash
bun run build
```

- Run lint/typecheck:

```bash
bun run lint
bun run tsc --noEmit
```

Notes and conventions

- `bun.lockb` is the lockfile and should be committed.
- Use `bun run <script>` to run any `package.json` scripts rather than `npm`/`yarn` to keep behavior consistent.
- When running locally in CI or containers, ensure Bun is installed and available in PATH. Example install: https://bun.sh/

Runtime considerations

- Bun provides a fast runtime for scripts and improves install speeds. However, Node-specific native binaries or Node-only tooling may behave differently; test CI pipelines before switching environments.

Troubleshooting

- If a script fails under Bun but works under Node, try `bun install --force` to refresh native modules and re-run the script.
- For Next.js local development use the `dev` script (`bun run dev`) which will invoke `next dev` as defined in `package.json`.

If your local environment must use `npm`/`yarn` temporarily, keep consistent dev environment notes in `docs/` and file an issue to standardize the environment across the team.
