import type {
  DefaultError,
  MutationKey,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type QueryToastOptions = {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
};

export type MutationToastOptions = QueryToastOptions;

export type AppUseQueryOptions<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & QueryToastOptions;

export type AppUseMutationOptions<
  TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext> &
  MutationToastOptions;

export type AppUseMutationParams<
  TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = {
  mutationKey?: MutationKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  options?: AppUseMutationOptions<TData, TError, TVariables, TContext>;
};
