import request from "@/lib/apis/http/request/request";
import type {
  TransactionQueryParams,
  TransactionsApiEnvelope,
} from "@/types/apis/transactions/transaction-response-types/transaction-response-types";

function toQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(function appendQuery([key, value]) {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

function getTransactions(params: TransactionQueryParams) {
  const query = toQuery({
    page: params.page,
    limit: params.limit,
    type: params.type,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return request<TransactionsApiEnvelope<unknown>>({
    path: `/transaction?${query}`,
    method: "GET",
  });
}

const transactionsRoutes = {
  getTransactions,
};

export default transactionsRoutes;
