UI / Ant Design module

Purpose

- Guidelines for using Ant Design across the app and where shared UI components live.

Conventions

- Ant Design is the primary UI library. Prefer Ant components for layout and controls.
- Shared UI components live in `src/components/ui`.
- Theme and customization: place tokens and overrides in `src/styles/antd-overrides.less` or similar.

Notes

- Keep component wrappers small and focused. Document props and variants in the component's module README.
- For authentication forms (login, signup, forgot-password), use Ant Design `Form` validation and Ant controls only.
- For OTP verification in forgot-password flow, use Ant Design `Input.OTP`.
- Route guards and auth flow UI states should also use Ant Design components for loading and feedback (e.g., `Spin`, `message`).
