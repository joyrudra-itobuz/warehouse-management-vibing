"use client";

import { useEffect, useMemo, useState } from "react";
import { Col, Empty, Flex, Layout, Row, Spin } from "antd";

import DashboardCategoryChart from "@/components/dashboard/charts/dashboard-category-chart/dashboard-category-chart";
import DashboardComparisonChart from "@/components/dashboard/charts/dashboard-comparison-chart/dashboard-comparison-chart";
import DashboardSidebar from "@/components/dashboard/layout/dashboard-sidebar/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/layout/dashboard-topbar/dashboard-topbar";
import DashboardStatCard from "@/components/dashboard/widgets/dashboard-stat-card/dashboard-stat-card";
import DashboardLowStockTable from "@/components/dashboard/tables/dashboard-low-stock-table/dashboard-low-stock-table";
import DashboardTopProductsTable from "@/components/dashboard/tables/dashboard-top-products-table/dashboard-top-products-table";
import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { dashboardRoutes } from "@/lib/apis/routes";
import type {
  DashboardApiEnvelope,
  DashboardChartPoint,
  DashboardTableRow,
  WarehouseItem,
} from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Content } = Layout;

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
      const id =
        String(record.id ?? record._id ?? record.warehouseId ?? `w-${index}`) ||
        `w-${index}`;
      const name =
        String(
          record.name ?? record.warehouseName ?? `Warehouse ${index + 1}`,
        ) || `Warehouse ${index + 1}`;

      return { id, name };
    })
    .filter(function isWarehouse(value): value is WarehouseItem {
      return value !== null;
    });
}

function extractStats(data: unknown) {
  if (!data || typeof data !== "object") {
    return {
      totalOrders: 0,
      deliveredOrders: 0,
      pendingOrders: 0,
      returnRate: 0,
    };
  }

  const record = data as Record<string, unknown>;

  return {
    totalOrders: toNumber(
      record.totalOrders ?? record.totalTransaction ?? record.total,
    ),
    deliveredOrders: toNumber(
      record.deliveredOrders ?? record.completed ?? record.success,
    ),
    pendingOrders: toNumber(record.pendingOrders ?? record.pending),
    returnRate: toNumber(
      record.returnRate ?? record.cancelledPercent ?? record.cancelledRate,
    ),
  };
}

function extractChartData(data: unknown): DashboardChartPoint[] {
  return toArray(data)
    .map(function mapChart(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        label: String(
          record.label ??
            record.name ??
            record.category ??
            record.month ??
            record.date ??
            `Item ${index + 1}`,
        ),
        value: toNumber(
          record.value ?? record.count ?? record.quantity ?? record.total,
        ),
      };
    })
    .filter(function isChartPoint(value): value is DashboardChartPoint {
      return value !== null;
    });
}

function extractRows(data: unknown): DashboardTableRow[] {
  return toArray(data)
    .map(function mapRow(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        id: String(
          record.id ?? record._id ?? record.productId ?? `row-${index}`,
        ),
        name: String(
          record.name ?? record.productName ?? `Product ${index + 1}`,
        ),
        quantity: toNumber(record.quantity ?? record.qty ?? record.stock),
        amount: toNumber(record.amount ?? record.price ?? record.totalSales),
        status: String(record.status ?? "Low"),
      };
    })
    .filter(function isRow(value): value is DashboardTableRow {
      return value !== null;
    });
}

export default function DashboardPageContent() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const warehousesQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "warehouses"],
    queryFn: dashboardRoutes.getWarehouses,
    errorMessage: "Unable to load warehouses.",
  });

  const warehouses = useMemo(
    function memoWarehouses() {
      return extractWarehouses(warehousesQuery.data?.data);
    },
    [warehousesQuery.data],
  );

  useEffect(
    function syncWarehouseSelection() {
      if (selectedWarehouseId || warehouses.length === 0) {
        return;
      }

      setSelectedWarehouseId(warehouses[0].id);
    },
    [selectedWarehouseId, warehouses],
  );

  const statsQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "stats", selectedWarehouseId],
    queryFn: function queryStats() {
      return dashboardRoutes.getTransactionStats(selectedWarehouseId as string);
    },
    enabled: Boolean(selectedWarehouseId),
    errorMessage: "Unable to load transaction stats.",
  });

  const inventoryCategoryQuery = useAppQuery<
    DashboardApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["dashboard", "inventory-category", selectedWarehouseId],
    queryFn: function queryInventoryCategory() {
      return dashboardRoutes.getInventoryByCategory(
        selectedWarehouseId as string,
      );
    },
    enabled: Boolean(selectedWarehouseId),
    errorMessage: "Unable to load category analytics.",
  });

  const lowStockQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "low-stock", selectedWarehouseId],
    queryFn: function queryLowStock() {
      return dashboardRoutes.getLowStockProducts(selectedWarehouseId as string);
    },
    enabled: Boolean(selectedWarehouseId),
    errorMessage: "Unable to load low stock products.",
  });

  const topSellingQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "top-selling", selectedWarehouseId],
    queryFn: function queryTopSelling() {
      return dashboardRoutes.getTopSellingProducts({
        warehouseId: selectedWarehouseId as string,
        limit: 6,
      });
    },
    enabled: Boolean(selectedWarehouseId),
    errorMessage: "Unable to load top selling products.",
  });

  const comparisonQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["analytics", "comparison", selectedWarehouseId],
    queryFn: function queryComparison() {
      return dashboardRoutes.getProductComparisonHistory({
        warehouseId: selectedWarehouseId as string,
        productA: "Backpack",
        productB: "Hand bag",
      });
    },
    enabled: Boolean(selectedWarehouseId),
    errorMessage: "Unable to load product trend analytics.",
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
        <Empty description="No warehouse found for dashboard" />
      </main>
    );
  }

  const stats = extractStats(statsQuery.data?.data);
  const categoryData = extractChartData(inventoryCategoryQuery.data?.data);
  const comparisonData = extractChartData(comparisonQuery.data?.data);
  const topSellingRows = extractRows(topSellingQuery.data?.data);
  const lowStockRows = extractRows(lowStockQuery.data?.data);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashboardSidebar selectedKey="dashboard" />
      <Layout>
        <Content style={{ padding: 24 }}>
          <DashboardTopbar
            warehouses={warehouses}
            selectedWarehouseId={selectedWarehouseId}
            onChangeWarehouse={setSelectedWarehouseId}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} xl={6}>
              <DashboardStatCard
                title="Total Orders"
                value={stats.totalOrders}
                trend="+17%"
                highlighted
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <DashboardStatCard
                title="Delivered"
                value={stats.deliveredOrders}
                trend="+7%"
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <DashboardStatCard
                title="Pending"
                value={stats.pendingOrders}
                trend="+4%"
              />
            </Col>
            <Col xs={24} md={12} xl={6}>
              <DashboardStatCard
                title="Return Rate"
                value={`${stats.returnRate}%`}
                trend="-2%"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 6 }}>
            <Col xs={24} xl={14}>
              <DashboardCategoryChart data={categoryData} />
            </Col>
            <Col xs={24} xl={10}>
              <DashboardComparisonChart data={comparisonData} />
            </Col>
            <Col xs={24} xl={14}>
              <DashboardTopProductsTable
                data={topSellingRows}
                loading={topSellingQuery.isLoading}
              />
            </Col>
            <Col xs={24} xl={10}>
              <DashboardLowStockTable
                data={lowStockRows}
                loading={lowStockQuery.isLoading}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
