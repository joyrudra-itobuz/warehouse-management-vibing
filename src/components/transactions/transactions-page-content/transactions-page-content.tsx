"use client";

import { useMemo, useState } from "react";
import { Empty } from "antd";

import TransactionsTopbar from "@/components/transactions/layout/transactions-topbar/transactions-topbar";
import TransactionDetailsModal from "@/components/transactions/modals/transaction-details-modal/transaction-details-modal";
import TransactionsTable from "@/components/transactions/tables/transactions-table/transactions-table";
import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { transactionsRoutes } from "@/lib/apis/routes";
import type {
  TransactionDetails,
  TransactionPagination,
  TransactionRow,
  TransactionsApiEnvelope,
} from "@/types/apis/transactions/transaction-response-types/transaction-response-types";

function toArray(input: unknown): unknown[] {
  if (Array.isArray(input)) {
    return input;
  }

  if (input && typeof input === "object") {
    const objectValue = input as Record<string, unknown>;

    if (Array.isArray(objectValue.data)) {
      return objectValue.data;
    }

    if (Array.isArray(objectValue.items)) {
      return objectValue.items;
    }

    if (Array.isArray(objectValue.transactions)) {
      return objectValue.transactions;
    }
  }

  return [];
}

function extractTransactions(input: unknown): unknown[] {
  if (!input || typeof input !== "object") {
    return [];
  }

  const payload = input as Record<string, unknown>;

  if (Array.isArray(payload.transactions)) {
    return payload.transactions;
  }

  return toArray(input);
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toDateLabel(value: unknown): string {
  if (typeof value !== "string" || !value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
}

function extractRows(data: unknown): TransactionRow[] {
  return extractTransactions(data)
    .map(function mapRow(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const product =
        record.product && typeof record.product === "object"
          ? (record.product as Record<string, unknown>)
          : null;
      const performedBy =
        record.performedBy && typeof record.performedBy === "object"
          ? (record.performedBy as Record<string, unknown>)
          : null;
      const sourceWarehouse =
        record.sourceWarehouse && typeof record.sourceWarehouse === "object"
          ? (record.sourceWarehouse as Record<string, unknown>)
          : null;
      const destinationWarehouse =
        record.destinationWarehouse &&
        typeof record.destinationWarehouse === "object"
          ? (record.destinationWarehouse as Record<string, unknown>)
          : null;

      const quantity = toNumber(record.quantity);
      const price = toNumber(product?.price ?? record.productPrice);
      const status = String(
        record.shipment ?? record.status ?? record.stage ?? record.state ?? "-",
      );
      const sourceWarehouseName = String(
        sourceWarehouse?.name ??
          record.sourceWarehouseName ??
          record.sourceWarehouse ??
          "-",
      );
      const destinationWarehouseName = String(
        destinationWarehouse?.name ??
          record.destinationWarehouseName ??
          record.destinationWarehouse ??
          "-",
      );

      const details: TransactionDetails = {
        id: String(record._id ?? record.id ?? `transaction-${index}`),
        type: String(record.type ?? record.transactionType ?? "-"),
        status,
        createdAt: toDateLabel(record.createdAt ?? record.date),
        quantity,
        notes: String(record.notes ?? "-"),
        reason: String(record.reason ?? "-"),
        productName: String(product?.name ?? "-"),
        productCategory: String(product?.category ?? "-"),
        productDescription: String(product?.description ?? "-"),
        productPrice: price,
        productImages: Array.isArray(product?.productImage)
          ? product?.productImage
              .filter(function filterImage(value) {
                return typeof value === "string";
              })
              .map(function mapImage(value) {
                return String(value);
              })
          : [],
        customerName: String(record.customerName ?? "-"),
        customerEmail: String(record.customerEmail ?? "-"),
        customerPhone: String(record.customerPhone ?? "-"),
        customerAddress: String(record.customerAddress ?? "-"),
        supplier: String(record.supplier ?? "-"),
        performedByName: String(performedBy?.name ?? "-"),
        performedByEmail: String(performedBy?.email ?? "-"),
        performedByRole: String(performedBy?.role ?? "-"),
        sourceWarehouse: sourceWarehouseName,
        destinationWarehouse: destinationWarehouseName,
      };

      return {
        id: String(record._id ?? record.id ?? `transaction-${index}`),
        date: toDateLabel(record.createdAt ?? record.date),
        type: String(record.type ?? record.transactionType ?? "-"),
        status,
        productName: details.productName,
        sourceWarehouse: sourceWarehouseName,
        destinationWarehouse: destinationWarehouseName,
        itemCount: quantity,
        totalAmount: quantity * price,
        details,
      };
    })
    .filter(function filterRow(value): value is TransactionRow {
      return value !== null;
    });
}

function extractPagination(
  data: unknown,
  page: number,
  limit: number,
): TransactionPagination {
  if (!data || typeof data !== "object") {
    return { total: 0, page, limit };
  }

  const record = data as Record<string, unknown>;
  const pagination =
    record.pagination && typeof record.pagination === "object"
      ? (record.pagination as Record<string, unknown>)
      : record;

  return {
    total: toNumber(
      pagination.total ?? pagination.totalCount ?? pagination.count,
    ),
    page: toNumber(pagination.page) || page,
    limit: toNumber(pagination.limit) || limit,
  };
}

export default function TransactionsPageContent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetails | null>(null);

  const transactionsQuery = useAppQuery<
    TransactionsApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["transactions", page, limit, type, status, startDate, endDate],
    queryFn: function queryTransactions() {
      return transactionsRoutes.getTransactions({
        page,
        limit,
        type,
        status,
        startDate,
        endDate,
      });
    },
    errorMessage: "Unable to load transactions.",
  });

  const rows = useMemo(
    function memoRows() {
      return extractRows(transactionsQuery.data?.data);
    },
    [transactionsQuery.data],
  );

  const pagination = useMemo(
    function memoPagination() {
      return extractPagination(transactionsQuery.data?.data, page, limit);
    },
    [transactionsQuery.data, page, limit],
  );

  const availableStatuses = useMemo(
    function memoStatuses() {
      const set = new Set<string>();

      rows.forEach(function addStatus(item) {
        if (item.status && item.status !== "-") {
          set.add(item.status);
        }
      });

      if (status && status !== "-") {
        set.add(status);
      }

      return Array.from(set);
    },
    [rows, status],
  );

  return (
    <>
      <TransactionsTopbar
        typeValue={type}
        statusValue={status}
        startDate={startDate}
        endDate={endDate}
        availableStatuses={availableStatuses}
        onChangeType={function onChangeType(value) {
          setPage(1);
          setType(value);
        }}
        onChangeStatus={function onChangeStatus(value) {
          setPage(1);
          setStatus(value);
        }}
        onChangeDateRange={function onChangeDateRange(start, end) {
          setPage(1);
          setStartDate(start);
          setEndDate(end);
        }}
        onResetFilters={function onResetFilters() {
          setPage(1);
          setType(undefined);
          setStatus(undefined);
          setStartDate(undefined);
          setEndDate(undefined);
        }}
      />

      {rows.length === 0 && !transactionsQuery.isLoading ? (
        <Empty description="No transactions found" />
      ) : (
        <TransactionsTable
          data={rows}
          loading={transactionsQuery.isLoading}
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          onChangePage={function onChangePage(nextPage, nextLimit) {
            setPage(nextPage);
            setLimit(nextLimit);
          }}
          onRowClick={function onRowClick(transaction) {
            setSelectedTransaction(transaction.details);
          }}
        />
      )}

      <TransactionDetailsModal
        open={Boolean(selectedTransaction)}
        onClose={function onCloseModal() {
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </>
  );
}
