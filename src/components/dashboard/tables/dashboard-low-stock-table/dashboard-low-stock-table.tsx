"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DashboardTableRow } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardLowStockTableProps = {
  data: DashboardTableRow[];
  loading: boolean;
};

const columns: ColumnsType<DashboardTableRow> = [
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: function renderStatus(value?: string) {
      return <Tag color="red">{value ?? "Low"}</Tag>;
    },
  },
];

export default function DashboardLowStockTable({
  data,
  loading,
}: DashboardLowStockTableProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Low Stock Products</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        style={{ marginTop: 12 }}
      />
    </Card>
  );
}
