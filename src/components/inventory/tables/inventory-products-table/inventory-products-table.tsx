"use client";

import { Card, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";

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
  if (loading) {
    return (
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <Text strong>{title}</Text>
        <AccentSkeletonThemeProvider>
          <Space
            direction="vertical"
            size={12}
            style={{ width: "100%", marginTop: 12 }}
          >
            <Skeleton.Input active size="small" style={{ width: 220 }} />
            <Skeleton
              active
              paragraph={{
                rows: 7,
                width: ["100%", "96%", "98%", "97%", "99%", "95%", "96%"],
              }}
              title={false}
            />
          </Space>
        </AccentSkeletonThemeProvider>
      </Card>
    );
  }

  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>{title}</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={false}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        style={{ marginTop: 12 }}
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
