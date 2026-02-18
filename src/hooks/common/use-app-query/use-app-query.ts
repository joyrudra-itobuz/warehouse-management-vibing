"use client";

import { useEffect, useRef } from "react";
import { message } from "antd";
import {
  type DefaultError,
  type QueryKey,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";

import getErrorMessage from "@/lib/utils/common/get-error-message/get-error-message";
import type { AppUseQueryOptions } from "@/types/hooks/common/react-query-wrapper-types/react-query-wrapper-types";

const useAppQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: AppUseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> => {
  const {
    successMessage,
    errorMessage,
    showSuccessToast = false,
    showErrorToast = true,
    ...queryOptions
  } = options;

  const queryResult = useQuery(queryOptions);
  const lastDataUpdateRef = useRef(0);
  const lastErrorUpdateRef = useRef(0);

  useEffect(() => {
    if (!showSuccessToast || !successMessage || !queryResult.isSuccess) {
      return;
    }

    if (queryResult.dataUpdatedAt === lastDataUpdateRef.current) {
      return;
    }

    lastDataUpdateRef.current = queryResult.dataUpdatedAt;
    message.success(successMessage);
  }, [
    queryResult.dataUpdatedAt,
    queryResult.isSuccess,
    showSuccessToast,
    successMessage,
  ]);

  useEffect(() => {
    if (!showErrorToast || !queryResult.isError) {
      return;
    }

    if (queryResult.errorUpdatedAt === lastErrorUpdateRef.current) {
      return;
    }

    lastErrorUpdateRef.current = queryResult.errorUpdatedAt;

    const fallback = errorMessage ?? "Unable to fetch data right now.";
    const text = getErrorMessage(queryResult.error, fallback);

    message.error(text);
  }, [
    errorMessage,
    queryResult.error,
    queryResult.errorUpdatedAt,
    queryResult.isError,
    showErrorToast,
  ]);

  return queryResult;
};

export default useAppQuery;
