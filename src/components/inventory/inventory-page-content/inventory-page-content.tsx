"use client";

import { useMemo, useState } from "react";
import { Empty, Flex, Layout, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";

import DashboardSidebar from "@/components/dashboard/layout/dashboard-sidebar/dashboard-sidebar";
import InventoryTopbar from "@/components/inventory/layout/inventory-topbar/inventory-topbar";
import InventoryProductsTable from "@/components/inventory/tables/inventory-products-table/inventory-products-table";
import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { inventoryRoutes } from "@/lib/apis/routes";
import type {
  InventoryApiEnvelope,
  InventoryProductRow,
  WarehouseItem,
} from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

const { Content } = Layout;

type InventoryTabKey = "all" | "warehouse" | "archived";

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

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function extractWarehouses(data: unknown): WarehouseItem[] {
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
      };
    })
    .filter(function isWarehouse(value): value is WarehouseItem {
      return value !== null;
    });
}

function extractInventoryProducts(data: unknown): InventoryProductRow[] {
  return toArray(data)
    .map(function mapProduct(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        id: String(
          record.productId ?? record._id ?? record.id ?? `product-${index}`,
        ),
        name: String(
          record.productName ?? record.name ?? `Product ${index + 1}`,
        ),
        category: String(record.category ?? "Uncategorized"),
        quantity: toNumber(
          record.totalQuantity ??
            record.quantity ??
            record.stock ??
            record.totalSoldQuantity ??
            record.availableQuantity,
        ),
        price: toNumber(record.price ?? record.sellingPrice ?? 0),
        status: Boolean(record.isArchived) ? "Archived" : "Active",
      };
    })
    .filter(function isProduct(value): value is InventoryProductRow {
      return value !== null;
    });
}

export default function InventoryPageContent() {
  const [activeTab, setActiveTab] = useState<InventoryTabKey>("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const warehousesQuery = useAppQuery<InventoryApiEnvelope<unknown>, Error>({
    queryKey: ["inventory", "warehouses"],
    queryFn: inventoryRoutes.getWarehouses,
    errorMessage: "Unable to load warehouses.",
  });

  const warehouses = useMemo(
    function memoWarehouses() {
      return extractWarehouses(warehousesQuery.data?.data);
    },
    [warehousesQuery.data],
  );

  const activeWarehouseId = selectedWarehouseId ?? warehouses[0]?.id ?? null;

  const allProductsQuery = useAppQuery<InventoryApiEnvelope<unknown>, Error>({
    queryKey: ["inventory", "all-products", searchValue],
    queryFn: function queryAllProducts() {
      return inventoryRoutes.getAllProducts({
        search: searchValue,
        page: 1,
        limit: 10,
        sort: "latest",
      });
    },
    enabled: activeTab === "all",
    errorMessage: "Unable to load all products.",
  });

  const archivedProductsQuery = useAppQuery<
    InventoryApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["inventory", "archived-products", searchValue],
    queryFn: function queryArchivedProducts() {
      return inventoryRoutes.getArchivedProducts({
        search: searchValue,
        page: 1,
        limit: 10,
        sort: "latest",
      });
    },
    enabled: activeTab === "archived",
    errorMessage: "Unable to load archived products.",
  });

  const warehouseProductsQuery = useAppQuery<
    InventoryApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["inventory", "warehouse-products", activeWarehouseId],
    queryFn: function queryWarehouseProducts() {
      return inventoryRoutes.getWarehouseProducts(activeWarehouseId as string);
    },
    enabled: activeTab === "warehouse" && Boolean(activeWarehouseId),
    errorMessage: "Unable to load warehouse products.",
  });

  if (warehousesQuery.isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (warehouses.length === 0) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        <Empty description="No warehouse found for inventory" />
      </main>
    );
  }

  const allProducts = extractInventoryProducts(allProductsQuery.data?.data);
  const archivedProducts = extractInventoryProducts(
    archivedProductsQuery.data?.data,
  );
  const warehouseProducts = extractInventoryProducts(
    warehouseProductsQuery.data?.data,
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "All Products",
      children: (
        <InventoryProductsTable
          title="All Products"
          data={allProducts}
          loading={allProductsQuery.isLoading}
        />
      ),
    },
    {
      key: "warehouse",
      label: "Warehouse Products",
      children: (
        <InventoryProductsTable
          title="Warehouse Based Products"
          data={warehouseProducts}
          loading={warehouseProductsQuery.isLoading}
        />
      ),
    },
    {
      key: "archived",
      label: "Archived Products",
      children: (
        <InventoryProductsTable
          title="Archived Products"
          data={archivedProducts}
          loading={archivedProductsQuery.isLoading}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardSidebar selectedKey="inventory" />
      <Layout>
        <Content style={{ padding: 24 }}>
          <InventoryTopbar
            searchValue={searchValue}
            onChangeSearch={setSearchValue}
            selectedWarehouseId={activeWarehouseId}
            onChangeWarehouse={setSelectedWarehouseId}
            warehouses={warehouses}
            showWarehouseSelector={activeTab === "warehouse"}
          />

          <Tabs
            activeKey={activeTab}
            onChange={function onChange(tabKey) {
              setActiveTab(tabKey as InventoryTabKey);
            }}
            items={tabItems}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
