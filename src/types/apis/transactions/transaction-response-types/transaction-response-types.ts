export type TransactionsApiEnvelope<TData = unknown> = {
  message: string;
  success: boolean;
  data: TData;
};

export type TransactionTypeOption = "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";

export type TransactionQueryParams = {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type TransactionRow = {
  id: string;
  date: string;
  type: string;
  status: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  itemCount: number;
  totalAmount: number;
};

export type TransactionPagination = {
  total: number;
  page: number;
  limit: number;
};
