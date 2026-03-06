"use client";

import { Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { DashboardTableRow } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import TableBodySkeleton from "@/components/common/table-body-skeleton/table-body-skeleton";

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
  return (
    <Card
      bordered={false}
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
      <Text strong>Top Selling Products</Text>
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
