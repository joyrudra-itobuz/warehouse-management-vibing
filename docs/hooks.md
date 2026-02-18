Hooks module

Purpose

- Contains conventions for react-query wrapper hooks and how to handle errors and toasts.

Conventions

- Hook location: `src/hooks/`.
- Use a shared `QueryClient` from `src/lib/queryClient.ts` and ensure the app is wrapped in `QueryClientProvider`.
- Implement a small wrapper `useApi` that standardizes `useQuery`/`useMutation` usage and calls `enqueueSnackbar` for errors.

Examples

- `src/hooks/useOrders.ts` — list orders using `src/lib/api/orders.getOrders`.
