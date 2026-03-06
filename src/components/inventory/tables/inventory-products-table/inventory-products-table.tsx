"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableBodySkeleton from "@/components/common/table-body-skeleton/table-body-skeleton";

import type { InventoryProductRow } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { Text } = Typography;

type InventoryProductsTableProps = {
  title: string;
  data: InventoryProductRow[];
  loading: boolean;
  onRowClick?: (productId: string) => void;
};

const columns: ColumnsType<InventoryProductRow> = [
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
    render: function renderName(value: string) {
      return <Text>{value}</Text>;
    },
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: function renderCategory(value: string) {
      return <Tag>{value}</Tag>;
    },
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: function renderPrice(value: number) {
      return `$${value.toLocaleString()}`;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: function renderStatus(value: string) {
      return (
        <Text type={value === "Archived" ? "warning" : undefined}>{value}</Text>
      );
    },
  },
];

export default function InventoryProductsTable({
  title,
  data,
  loading,
  onRowClick,
}: InventoryProductsTableProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>{title}</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={loading ? [] : data}
        loading={false}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 12 }}
        locale={{
          emptyText: loading ? (
            <TableBodySkeleton rows={8} columns={5} />
          ) : undefined,
        }}
        onRow={function onRow(record) {
          return {
            onClick: function handleClick() {
              onRowClick?.(record.id);
            },
            style: onRowClick ? { cursor: "pointer" } : undefined,
          };
        }}
      />
    </Card>
  );
}
