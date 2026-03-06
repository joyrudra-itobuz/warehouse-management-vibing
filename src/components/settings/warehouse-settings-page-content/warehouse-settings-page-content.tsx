"use client";

import { useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Input,
  Row,
  Segmented,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { inventoryRoutes } from "@/lib/apis/routes";
import { usePreferencesStore } from "@/stores/preferences";
import type { InventoryApiEnvelope } from "@/types/apis/inventory/inventory-response-types/inventory-response-types";
import { type EditableThemePalette, type ThemeMode } from "@/theme/index";

const { Title, Text } = Typography;

type WarehouseManager = {
  id: string;
  name: string;
  email: string;
};

type WarehouseInfo = {
  id: string;
  name: string;
  address: string;
  description: string;
  active: boolean;
  capacity: number;
  maxTransactionPriceLimit: number;
  managers: WarehouseManager[];
};

const editableColorFields: Array<{
  key: keyof EditableThemePalette;
  label: string;
}> = [
  { key: "primary", label: "Primary" },
  { key: "bgBase", label: "Base Background" },
  { key: "bgContainer", label: "Container Background" },
  { key: "text", label: "Text" },
  { key: "textSecondary", label: "Secondary Text" },
  { key: "border", label: "Border" },
  { key: "sidebar", label: "Sidebar" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "error", label: "Error" },
  { key: "info", label: "Info" },
];

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

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function extractManagers(input: unknown): WarehouseManager[] {
  return toArray(input)
    .map(function mapManager(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        id: String(record._id ?? record.id ?? `m-${index}`),
        name: String(record.name ?? "Manager"),
        email: String(record.email ?? "-"),
      };
    })
    .filter(function isManager(value): value is WarehouseManager {
      return value !== null;
    });
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
        address:
          typeof record.address === "string"
            ? record.address
            : typeof record.location === "string"
              ? record.location
              : "-",
        description: String(record.description ?? "-"),
        active: Boolean(record.active),
        capacity: toNumber(record.capacity),
        maxTransactionPriceLimit: toNumber(record.maxTransactionPriceLimit),
        managers: extractManagers(record.managerIds),
      };
    })
    .filter(function isWarehouse(value): value is WarehouseInfo {
      return value !== null;
    });
}

type PaletteEditorProps = {
  title: string;
  mode: "light" | "dark";
  palette: EditableThemePalette;
  onChangeColor: (
    mode: "light" | "dark",
    colorKey: keyof EditableThemePalette,
    value: string,
  ) => void;
  onReset: (mode: "light" | "dark") => void;
};

function PaletteEditor({
  title,
  mode,
  palette,
  onChangeColor,
  onReset,
}: PaletteEditorProps) {
  return (
    <Card variant="borderless" style={{ borderRadius: 16 }} title={title}>
      <Space orientation="vertical" size={10} style={{ width: "100%" }}>
        {editableColorFields.map(function mapField(field) {
          return (
            <div
              key={field.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Text>{field.label}</Text>
              <Space align="center" size={8}>
                <Input
                  type="color"
                  value={palette[field.key]}
                  onChange={function onColorChange(event) {
                    onChangeColor(mode, field.key, event.target.value);
                  }}
                  style={{ width: 52, height: 34, padding: 2 }}
                />
                <Text style={{ minWidth: 80, textAlign: "right" }}>
                  {palette[field.key].toUpperCase()}
                </Text>
              </Space>
            </div>
          );
        })}
      </Space>

      <Button
        style={{ marginTop: 14 }}
        onClick={function onResetClick() {
          onReset(mode);
        }}
      >
        Reset {mode === "light" ? "Light" : "Dark"} Palette
      </Button>
    </Card>
  );
}

export default function WarehouseSettingsPageContent() {
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const lightPalette = usePreferencesStore((state) => state.lightPalette);
  const darkPalette = usePreferencesStore((state) => state.darkPalette);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);
  const setPaletteColor = usePreferencesStore((state) => state.setPaletteColor);
  const resetPalette = usePreferencesStore((state) => state.resetPalette);

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
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Warehouse Settings
        </Title>
        <Text type="secondary">
          Manage warehouse information and experiment with dynamic theme colors.
        </Text>
      </div>

      <Card
        variant="borderless"
        style={{ borderRadius: 16 }}
        title="Theme Mode"
      >
        <Segmented<ThemeMode>
          value={themeMode}
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ]}
          onChange={setThemeMode}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <PaletteEditor
            title="Light Theme Colors"
            mode="light"
            palette={lightPalette}
            onChangeColor={setPaletteColor}
            onReset={resetPalette}
          />
        </Col>
        <Col xs={24} xl={12}>
          <PaletteEditor
            title="Dark Theme Colors"
            mode="dark"
            palette={darkPalette}
            onChangeColor={setPaletteColor}
            onReset={resetPalette}
          />
        </Col>
      </Row>

      <Card
        variant="borderless"
        style={{ borderRadius: 16 }}
        title="Warehouse Information"
      >
        {warehousesQuery.isLoading ? (
          <Text type="secondary">Loading warehouse information...</Text>
        ) : warehouses.length === 0 ? (
          <Empty description="No warehouse information available" />
        ) : (
          <Space orientation="vertical" size={12} style={{ width: "100%" }}>
            {warehouses.map(function mapWarehouse(warehouse) {
              return (
                <Descriptions
                  key={warehouse.id}
                  bordered
                  size="small"
                  column={1}
                  labelStyle={{ width: 190 }}
                >
                  <Descriptions.Item label="Name">
                    {warehouse.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {warehouse.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {warehouse.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Manager(s)">
                    {warehouse.managers.length === 0 ? (
                      "-"
                    ) : (
                      <Space size={[8, 8]} wrap>
                        {warehouse.managers.map(function mapManager(manager) {
                          return (
                            <Tooltip key={manager.id} title={manager.email}>
                              <Tag>{manager.name}</Tag>
                            </Tooltip>
                          );
                        })}
                      </Space>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Active Status">
                    {warehouse.active ? "Active" : "Inactive"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Capacity">
                    {warehouse.capacity.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Max Transaction Price Limit">
                    ${warehouse.maxTransactionPriceLimit.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Warehouse ID">
                    {warehouse.id}
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </Space>
        )}
      </Card>
    </Space>
  );
}
