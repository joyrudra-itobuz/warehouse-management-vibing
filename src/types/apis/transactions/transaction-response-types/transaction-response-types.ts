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
  productName: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  itemCount: number;
  totalAmount: number;
  details: TransactionDetails;
};

export type TransactionPagination = {
  total: number;
  page: number;
  limit: number;
};

export type TransactionDetails = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  quantity: number;
  notes: string;
  reason: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  productPrice: number;
  productImages: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  supplier: string;
  performedByName: string;
  performedByEmail: string;
  performedByRole: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
};
