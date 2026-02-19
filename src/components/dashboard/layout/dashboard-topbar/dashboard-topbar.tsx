"use client";

import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Select, Space, Typography } from "antd";
import type { WarehouseItem } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Title, Text } = Typography;

type DashboardTopbarProps = {
  warehouses: WarehouseItem[];
  selectedWarehouseId: string | null;
  onChangeWarehouse: (warehouseId: string) => void;
};

export default function DashboardTopbar({
  warehouses,
  selectedWarehouseId,
  onChangeWarehouse,
}: DashboardTopbarProps) {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ marginBottom: 18, gap: 16, flexWrap: "wrap" }}
    >
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Live warehouse analytics and operational KPIs.
        </Text>
      </div>

      <Space size={10} wrap>
        <Input
          placeholder="Search here"
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Select
          placeholder="Select warehouse"
          style={{ width: 210 }}
          value={selectedWarehouseId ?? undefined}
          options={warehouses.map(function mapWarehouse(warehouse) {
            return {
              value: warehouse.id,
              label: warehouse.name,
            };
          })}
          onChange={onChangeWarehouse}
        />
        <Button icon={<BellOutlined />} />
      </Space>
    </Flex>
  );
}
