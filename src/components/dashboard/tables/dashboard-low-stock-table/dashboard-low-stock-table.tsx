"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DashboardTableRow } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import TableBodySkeleton from "@/components/common/table-body-skeleton/table-body-skeleton";

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
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        },
      }}
    >
      <Text strong>Low Stock Products</Text>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={loading ? [] : data}
        loading={false}
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 12 }}
        locale={{
          emptyText: loading ? (
            <TableBodySkeleton rows={7} columns={3} />
          ) : undefined,
        }}
      />
    </Card>
  );
}
