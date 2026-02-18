Auth module

Purpose

- Describe authentication mechanism and where auth helpers live.

Conventions

- Token handling: Bearer token via `Authorization` header.
- Client-side token store: use `src/lib/auth` for helpers (get/set token, refresh, attach header).
- Environment variables: `NEXT_PUBLIC_API_BASE` for base URL; server-only secrets stored in `.env`.

Notes

- If implementing silent refresh, document flow here and add endpoints used for refresh.

Forgot password flow (OTP based)

- Step 1: User enters email and calls `POST /user/auth/send-otp`.
  - Request DTO (`SendOtpDto`):
    - `email: string`
- Step 2: User enters OTP + new password and calls `POST /user/auth/forgot-password`.
  - Request DTO (`ForgotPasswordDto`):
    - `email: string`
    - `otp: string`
    - `password: string`

Implementation rules

- Auth pages must use Ant Design components and Ant Design form validation.
- OTP input must use Ant Design `Input.OTP`.
- API requests should use route modules (`src/lib/apis/routes`) and React Query wrapper hooks.
