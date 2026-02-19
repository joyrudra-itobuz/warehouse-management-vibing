"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Flex, Input, Select, Space, Typography } from "antd";
import type { WarehouseItem } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { Title, Text } = Typography;

type InventoryTopbarProps = {
  searchValue: string;
  onChangeSearch: (value: string) => void;
  selectedWarehouseId: string | null;
  onChangeWarehouse: (value: string) => void;
  warehouses: WarehouseItem[];
  showWarehouseSelector: boolean;
};

export default function InventoryTopbar({
  searchValue,
  onChangeSearch,
  selectedWarehouseId,
  onChangeWarehouse,
  warehouses,
  showWarehouseSelector,
}: InventoryTopbarProps) {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ marginBottom: 18, gap: 16, flexWrap: "wrap" }}
    >
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Inventory
        </Title>
        <Text type="secondary">
          All products, warehouse products, and archived products in one place.
        </Text>
      </div>

      <Space size={10} wrap>
        <Input
          placeholder="Search products"
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          value={searchValue}
          onChange={function onChange(event) {
            onChangeSearch(event.target.value);
          }}
        />
        {showWarehouseSelector ? (
          <Select
            placeholder="Select warehouse"
            style={{ width: 230 }}
            value={selectedWarehouseId ?? undefined}
            options={warehouses.map(function mapWarehouse(warehouse) {
              return {
                value: warehouse.id,
                label: warehouse.name,
              };
            })}
            onChange={onChangeWarehouse}
          />
        ) : null}
      </Space>
    </Flex>
  );
}
