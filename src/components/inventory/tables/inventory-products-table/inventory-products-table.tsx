"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { InventoryProductRow } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { Text } = Typography;

type InventoryProductsTableProps = {
  title: string;
  data: InventoryProductRow[];
  loading: boolean;
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
}: InventoryProductsTableProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>{title}</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        style={{ marginTop: 12 }}
      />
    </Card>
  );
}
