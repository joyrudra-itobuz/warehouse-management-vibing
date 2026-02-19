React Component Conventions

Purpose

- Document mandatory conventions for React components in this project.

Rules (mandatory)

- Use function declarations for components — do NOT use arrow functions.
  - Correct:

    ```tsx
    type ButtonProps = { label: string };

    export function Button(props: ButtonProps) {
      return <button>{props.label}</button>;
    }
    ```

  - Incorrect:
    ```tsx
    // Do not use this pattern in this repo
    const Button = (props: ButtonProps) => {
      return <button>{props.label}</button>;
    };
    ```

- Do NOT use `React.FC` (or `FC`) for component types. Instead declare a `type` for props and annotate the function parameter with that type.

- One component per file. A single file must export only one component (plus helper sub-exports). If you need smaller helpers, place them in separate files.

- File and folder layout should be context-aware and modular. Examples:
  - `src/components/auth/common/my-component/my-component.tsx`
  - `src/components/auth/sign-up/sign-up-button/sign-up-button.tsx`

- Component files should default export the main component when appropriate, and also provide a named export if needed. Prefer explicit named exports for shared primitives.

- When a component uses client-only features or AntD sub-components (`Select.Option`, `Typography.Text`, `Layout.Content`, etc.), mark the file with `"use client"` at the top.

- Keep components small and focused: if a piece can be reused or tested independently, extract it as a new component.

Examples

- Presentational component (no hooks): function declaration, typed props.

  ```tsx
  type AvatarProps = { src?: string; alt?: string };

  export function Avatar({ src, alt }: AvatarProps) {
    return <img src={src} alt={alt} />;
  }
  ```

- Client component using hooks / Ant sub-components:

  ```tsx
  "use client";

  import { useState } from "react";
  import { Select } from "antd";

  type SelectorProps = { options: { label: string; value: string }[] };

  export function Selector({ options }: SelectorProps) {
    const [value, setValue] = useState<string | undefined>(undefined);

    return <Select value={value} onChange={setValue} options={options} />;
  }
  ```

Notes

- These rules are strict: follow them for all new components and when refactoring existing files.
- If you have a compelling reason to deviate, open an issue and document the trade-offs.
