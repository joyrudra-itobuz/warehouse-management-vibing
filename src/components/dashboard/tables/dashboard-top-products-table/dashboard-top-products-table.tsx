"use client";

import { Card, Skeleton, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DashboardTableRow } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";

const { Text } = Typography;

type DashboardTopProductsTableProps = {
  data: DashboardTableRow[];
  loading: boolean;
};

const columns: ColumnsType<DashboardTableRow> = [
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
    render: function renderName(value: string) {
      return <Text>{value}</Text>;
    },
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: function renderAmount(value?: number) {
      if (typeof value !== "number") {
        return "-";
      }

      return `$${value.toLocaleString()}`;
    },
  },
];

export default function DashboardTopProductsTable({
  data,
  loading,
}: DashboardTopProductsTableProps) {
  if (loading) {
    return (
      <Card bordered={false} style={{ borderRadius: 16 }}>
        <Text strong>Top Selling Products</Text>
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
      <Text strong>Top Selling Products</Text>
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
