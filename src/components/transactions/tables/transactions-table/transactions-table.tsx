"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import TableBodySkeleton from "@/components/common/table-body-skeleton/table-body-skeleton";
import type { TransactionRow } from "@/types/apis/transactions/transaction-response-types/transaction-response-types";

const { Text } = Typography;

type TransactionsTableProps = {
  data: TransactionRow[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onChangePage: (page: number, limit: number) => void;
  onRowClick?: (transaction: TransactionRow) => void;
};

function getTypeColor(type: string) {
  switch (type) {
    case "IN":
      return "success";
    case "OUT":
      return "processing";
    case "TRANSFER":
      return "purple";
    case "ADJUSTMENT":
      return "warning";
    default:
      return "default";
  }
}

const columns: ColumnsType<TransactionRow> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: function renderType(value: string) {
      return <Tag color={getTypeColor(value)}>{value || "-"}</Tag>;
    },
  },
  {
    title: "Product",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: function renderStatus(value: string) {
      return <Text>{value || "-"}</Text>;
    },
  },
  {
    title: "Source Warehouse",
    dataIndex: "sourceWarehouse",
    key: "sourceWarehouse",
  },
  {
    title: "Destination Warehouse",
    dataIndex: "destinationWarehouse",
    key: "destinationWarehouse",
  },
  {
    title: "Items",
    dataIndex: "itemCount",
    key: "itemCount",
  },
  {
    title: "Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: function renderAmount(value: number) {
      return `$${value.toLocaleString()}`;
    },
  },
];

export default function TransactionsTable({
  data,
  loading,
  page,
  limit,
  total,
  onChangePage,
  onRowClick,
}: TransactionsTableProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={loading ? [] : data}
        loading={false}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        locale={{
          emptyText: loading ? (
            <TableBodySkeleton rows={8} columns={8} />
          ) : undefined,
        }}
        onChange={function onChangeTable(pagination: TablePaginationConfig) {
          const nextPage = pagination.current ?? 1;
          const nextLimit = pagination.pageSize ?? limit;
          onChangePage(nextPage, nextLimit);
        }}
        onRow={function onRow(record) {
          return {
            onClick: function handleClick() {
              onRowClick?.(record);
            },
            style: onRowClick ? { cursor: "pointer" } : undefined,
          };
        }}
      />
    </Card>
  );
}
