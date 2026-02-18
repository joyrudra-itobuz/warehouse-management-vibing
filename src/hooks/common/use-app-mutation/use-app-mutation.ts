"use client";

import { message } from "antd";
import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";

import getErrorMessage from "@/lib/utils/common/get-error-message/get-error-message";
import type {
  AppUseMutationParams,
  AppUseMutationOptions,
} from "@/types/hooks/common/react-query-wrapper-types/react-query-wrapper-types";

const useAppMutation = <
  TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  params: AppUseMutationParams<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const { mutationFn, mutationKey, options } = params;

  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError,
    ...mutationOptions
  } = (options ?? {}) as AppUseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
  >;

  return useMutation({
    ...mutationOptions,
    mutationKey,
    mutationFn,
    onSuccess: (data, variables, context, mutation) => {
      if (showSuccessToast && successMessage) {
        message.success(successMessage);
      }

      onSuccess?.(data, variables, context, mutation);
    },
    onError: (error, variables, context, mutation) => {
      if (showErrorToast) {
        const fallback = errorMessage ?? "Request failed. Please try again.";
        const text = getErrorMessage(error, fallback);

        message.error(text);
      }

      onError?.(error, variables, context, mutation);
    },
  });
};

export default useAppMutation;
