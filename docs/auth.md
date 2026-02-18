Auth module

Purpose

- Describe authentication mechanism and where auth helpers live.

Conventions

- Token handling: Bearer token via `Authorization` header.
- Client-side token store: use `src/lib/auth` for helpers (get/set token, refresh, attach header).
- Environment variables: `NEXT_PUBLIC_API_BASE` for base URL; server-only secrets stored in `.env`.

Route structure

- Auth pages live under `src/app/auth/*`.
  - `src/app/auth/layout.tsx`
  - `src/app/auth/login/page.tsx`
  - `src/app/auth/sign-up/page.tsx`
  - `src/app/auth/forgot-password/page.tsx`
- Protected pages live under `src/app/(protected)/*`.
  - `src/app/(protected)/layout.tsx`
  - `src/app/(protected)/dashboard/page.tsx`

State management (Zustand)

- Auth session state is stored in Zustand with persistence to localStorage.
- On successful login, store:
  - `accessToken`
  - `refreshToken`
  - `user` info
- Store location:
  - `src/stores/auth/auth-store/auth-store.ts`

Access rules

- Authenticated users cannot access auth routes (`/auth/*`) and are redirected to `/dashboard`.
- Unauthenticated users cannot access protected routes (e.g. `/dashboard`) and are redirected to `/auth/login`.

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
