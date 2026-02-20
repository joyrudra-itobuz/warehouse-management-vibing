"use client";

import { useMemo } from "react";
import {
  Card,
  Col,
  Descriptions,
  Empty,
  Input,
  Row,
  Segmented,
  Space,
  Typography,
} from "antd";

import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { inventoryRoutes } from "@/lib/apis/routes";
import { usePreferencesStore } from "@/stores/preferences";
import type { InventoryApiEnvelope } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";
import type { ThemeMode } from "@/theme";

const { Title, Text } = Typography;

type WarehouseInfo = {
  id: string;
  name: string;
  location: string | undefined;
  manager: string | undefined;
};

function toArray(input: unknown): unknown[] {
  if (Array.isArray(input)) {
    return input;
  }

  if (input && typeof input === "object") {
    const objectValue = input as Record<string, unknown>;

    if (Array.isArray(objectValue.data)) {
      return objectValue.data;
    }

    if (Array.isArray(objectValue.items)) {
      return objectValue.items;
    }

    const firstArray = Object.values(objectValue).find(
      function findArray(value) {
        return Array.isArray(value);
      },
    );

    if (Array.isArray(firstArray)) {
      return firstArray;
    }
  }

  return [];
}

function extractWarehouses(data: unknown): WarehouseInfo[] {
  return toArray(data)
    .map(function mapWarehouse(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        id: String(
          record._id ?? record.id ?? record.warehouseId ?? `w-${index}`,
        ),
        name: String(
          record.name ?? record.warehouseName ?? `Warehouse ${index + 1}`,
        ),
        location:
          typeof record.location === "string"
            ? record.location
            : typeof record.address === "string"
              ? record.address
              : undefined,
        manager:
          typeof record.manager === "string"
            ? record.manager
            : typeof record.managerName === "string"
              ? record.managerName
              : undefined,
      };
    })
    .filter(function isWarehouse(value): value is WarehouseInfo {
      return value !== null;
    });
}

export default function WarehouseSettingsPageContent() {
  const lightAccentColor = usePreferencesStore(
    (state) => state.lightAccentColor,
  );
  const darkAccentColor = usePreferencesStore((state) => state.darkAccentColor);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);
  const setLightAccentColor = usePreferencesStore(
    (state) => state.setLightAccentColor,
  );
  const setDarkAccentColor = usePreferencesStore(
    (state) => state.setDarkAccentColor,
  );

  const warehousesQuery = useAppQuery<InventoryApiEnvelope<unknown>, Error>({
    queryKey: ["settings", "warehouses"],
    queryFn: inventoryRoutes.getWarehouses,
    errorMessage: "Unable to load warehouse information.",
  });

  const warehouses = useMemo(
    function memoWarehouses() {
      return extractWarehouses(warehousesQuery.data?.data);
    },
    [warehousesQuery.data],
  );

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Warehouse Settings
        </Title>
        <Text type="secondary">
          Manage theme preferences and review warehouse information.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 16 }}
            title="Theme Preferences"
          >
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              <div>
                <Text strong>Theme Mode</Text>
                <div style={{ marginTop: 8 }}>
                  <Segmented<ThemeMode>
                    value={themeMode}
                    options={[
                      { label: "Light", value: "light" },
                      { label: "Dark", value: "dark" },
                      { label: "System", value: "system" },
                    ]}
                    onChange={setThemeMode}
                  />
                </div>
              </div>

              <div>
                <Text strong>Light Mode Accent</Text>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Input
                    type="color"
                    value={lightAccentColor}
                    onChange={function onChangeLightAccent(event) {
                      setLightAccentColor(event.target.value);
                    }}
                    style={{ width: 54, height: 38, padding: 4 }}
                  />
                  <Text>{lightAccentColor.toUpperCase()}</Text>
                </div>
              </div>

              <div>
                <Text strong>Dark Mode Accent</Text>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Input
                    type="color"
                    value={darkAccentColor}
                    onChange={function onChangeDarkAccent(event) {
                      setDarkAccentColor(event.target.value);
                    }}
                    style={{ width: 54, height: 38, padding: 4 }}
                  />
                  <Text>{darkAccentColor.toUpperCase()}</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card
            bordered={false}
            style={{ borderRadius: 16 }}
            title="Warehouse Information"
          >
            {warehousesQuery.isLoading ? (
              <Text type="secondary">Loading warehouse information...</Text>
            ) : warehouses.length === 0 ? (
              <Empty description="No warehouse information available" />
            ) : (
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {warehouses.map(function mapWarehouse(warehouse) {
                  return (
                    <Descriptions
                      key={warehouse.id}
                      bordered
                      size="small"
                      column={1}
                      labelStyle={{ width: 120 }}
                    >
                      <Descriptions.Item label="Name">
                        {warehouse.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="ID">
                        {warehouse.id}
                      </Descriptions.Item>
                      <Descriptions.Item label="Location">
                        {warehouse.location ?? "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Manager">
                        {warehouse.manager ?? "-"}
                      </Descriptions.Item>
                    </Descriptions>
                  );
                })}
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
