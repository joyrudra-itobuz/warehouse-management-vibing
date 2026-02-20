"use client";

import { Card, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DashboardTableRow } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";

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
  if (loading) {
    return (
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <Text strong>Low Stock Products</Text>
        <AccentSkeletonThemeProvider>
          <Space
            direction="vertical"
            size={12}
            style={{ width: "100%", marginTop: 12 }}
          >
            <Skeleton.Input active size="small" style={{ width: 200 }} />
            <Skeleton
              active
              paragraph={{
                rows: 6,
                width: ["100%", "95%", "98%", "96%", "99%", "94%"],
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
      <Text strong>Low Stock Products</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={false}
        pagination={false}
        style={{ marginTop: 12 }}
      />
    </Card>
  );
}
