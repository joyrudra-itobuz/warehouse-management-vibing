"use client";

import { useMemo, useState } from "react";
import { Col, Empty, Flex, Row, Spin } from "antd";

import DashboardCategoryChart from "@/components/dashboard/charts/dashboard-category-chart/dashboard-category-chart";
import DashboardComparisonChart from "@/components/dashboard/charts/dashboard-comparison-chart/dashboard-comparison-chart";
import DashboardIssuesChart from "@/components/dashboard/charts/dashboard-issues-chart/dashboard-issues-chart";
import DashboardTopbar from "@/components/dashboard/layout/dashboard-topbar/dashboard-topbar";
import DashboardStatCard from "@/components/dashboard/widgets/dashboard-stat-card/dashboard-stat-card";
import DashboardLowStockTable from "@/components/dashboard/tables/dashboard-low-stock-table/dashboard-low-stock-table";
import DashboardTopProductsTable from "@/components/dashboard/tables/dashboard-top-products-table/dashboard-top-products-table";
import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { dashboardRoutes } from "@/lib/apis/routes";
import type {
  DashboardApiEnvelope,
  DashboardChartPoint,
  DashboardSeriesChartPoint,
  DashboardTableRow,
  WarehouseItem,
} from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

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
      totalSales: 0,
      totalPurchase: 0,
      inventoryQuantity: 0,
      todayShipmentQuantity: 0,
      saleQuantity: 0,
      purchaseQuantity: 0,
    };
  }

  const record = data as Record<string, unknown>;
  const sales =
    record.sales && typeof record.sales === "object"
      ? (record.sales as Record<string, unknown>)
      : {};
  const purchase =
    record.purchase && typeof record.purchase === "object"
      ? (record.purchase as Record<string, unknown>)
      : {};
  const inventory =
    record.inventory && typeof record.inventory === "object"
      ? (record.inventory as Record<string, unknown>)
      : {};
  const todayShipment =
    record.todayShipment && typeof record.todayShipment === "object"
      ? (record.todayShipment as Record<string, unknown>)
      : {};

  return {
    totalSales: toNumber(sales.totalSales),
    saleQuantity: toNumber(sales.saleQuantity),
    totalPurchase: toNumber(purchase.totalPurchase),
    purchaseQuantity: toNumber(purchase.purchaseQuantity),
    inventoryQuantity: toNumber(inventory.totalQuantity),
    todayShipmentQuantity: toNumber(todayShipment.quantity),
  };
}

function extractProductTransactionSeries(
  data: unknown,
): DashboardSeriesChartPoint[] {
  return toArray(data)
    .flatMap(function mapTransaction(item, index) {
      if (!item || typeof item !== "object") {
        return [];
      }

      const record = item as Record<string, unknown>;
      const label = String(record._id ?? record.date ?? `Day ${index + 1}`);

      return [
        {
          label,
          series: "IN",
          value: toNumber(record.IN ?? record.in ?? 0),
        },
        {
          label,
          series: "OUT",
          value: toNumber(record.OUT ?? record.out ?? 0),
        },
      ];
    })
    .filter(function isSeriesPoint(value): value is DashboardSeriesChartPoint {
      return value !== null;
    });
}

function extractInventoryCategoryChartData(
  data: unknown,
): DashboardChartPoint[] {
  return toArray(data)
    .map(function mapCategory(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      const label = String(
        record._id ?? record.category ?? record.name ?? `Category ${index + 1}`,
      );

      const value = toNumber(
        record.totalProducts ??
          record.total ??
          record.count ??
          (Array.isArray(record.products) ? record.products.length : 0),
      );

      return {
        label,
        value,
      };
    })
    .filter(function isChartPoint(value): value is DashboardChartPoint {
      return value !== null;
    });
}

function extractRows(data: unknown): DashboardTableRow[] {
  return toArray(data).reduce<DashboardTableRow[]>(function reduceRows(
    rows,
    item,
    index,
  ) {
    if (!item || typeof item !== "object") {
      return rows;
    }

    const record = item as Record<string, unknown>;

    rows.push({
      id: String(record.id ?? record._id ?? record.productId ?? `row-${index}`),
      name: String(record.name ?? record.productName ?? `Product ${index + 1}`),
      quantity: toNumber(record.quantity ?? record.qty ?? record.stock),
      amount: toNumber(record.amount ?? record.price ?? record.totalSales),
      status: String(record.status ?? "Low"),
    });

    return rows;
  }, []);
}

function extractTopSellingRows(data: unknown): DashboardTableRow[] {
  return toArray(data).reduce<DashboardTableRow[]>(function reduceTopRows(
    rows,
    item,
    index,
  ) {
    if (!item || typeof item !== "object") {
      return rows;
    }

    const record = item as Record<string, unknown>;

    rows.push({
      id: String(record.productId ?? record.id ?? record._id ?? `top-${index}`),
      name: String(
        record.productName ?? record.name ?? `Product ${index + 1}`,
      ),
      quantity: toNumber(record.totalSoldQuantity ?? record.quantity),
      amount: toNumber(record.totalSalesAmount ?? record.amount),
      status: String(record.category ?? record.status ?? "Top"),
    });

    return rows;
  }, []);
}

function extractIssueSeriesData(
  cancelled: unknown,
  adjusted: unknown,
): DashboardSeriesChartPoint[] {
  const cancelledSeries = toArray(cancelled).map(
    function mapCancelled(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        label: String(
          record.productName ?? record.category ?? `Product ${index + 1}`,
        ),
        value: toNumber(record.totalCancelledQuantity ?? 0),
        series: "Cancelled",
      };
    },
  );

  const adjustedSeries = toArray(adjusted).map(
    function mapAdjusted(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        label: String(
          record.productName ?? record.category ?? `Product ${index + 1}`,
        ),
        value: toNumber(record.totalAdjustedQuantity ?? 0),
        series: "Adjusted",
      };
    },
  );

  return [...cancelledSeries, ...adjustedSeries].filter(
    function isSeriesPoint(value): value is DashboardSeriesChartPoint {
      return value !== null;
    },
  );
}

function getDateRange(days: number) {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(endDate.getDate() - days);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
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

  const activeWarehouseId = selectedWarehouseId ?? warehouses[0]?.id ?? null;

  const statsQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "stats", activeWarehouseId],
    queryFn: function queryStats() {
      return dashboardRoutes.getTransactionStats(activeWarehouseId as string);
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load transaction stats.",
  });

  const inventoryCategoryQuery = useAppQuery<
    DashboardApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["dashboard", "inventory-category", activeWarehouseId],
    queryFn: function queryInventoryCategory() {
      return dashboardRoutes.getInventoryByCategory(
        activeWarehouseId as string,
      );
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load category analytics.",
  });

  const lowStockQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "low-stock", activeWarehouseId],
    queryFn: function queryLowStock() {
      return dashboardRoutes.getLowStockProducts(activeWarehouseId as string);
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load low stock products.",
  });

  const topSellingQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "top-selling", activeWarehouseId],
    queryFn: function queryTopSelling() {
      return dashboardRoutes.getTopSellingProducts({
        warehouseId: activeWarehouseId as string,
        limit: 6,
      });
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load top selling products.",
  });

  const productTransactionQuery = useAppQuery<
    DashboardApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["dashboard", "product-transaction", activeWarehouseId],
    queryFn: function queryProductTransaction() {
      return dashboardRoutes.getProductTransaction(activeWarehouseId as string);
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load product transaction chart data.",
  });

  const cancelledOrdersQuery = useAppQuery<
    DashboardApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["dashboard", "cancelled-orders", activeWarehouseId],
    queryFn: function queryCancelledOrders() {
      const range = getDateRange(30);

      return dashboardRoutes.getCancelledOrders({
        warehouseId: activeWarehouseId as string,
        limit: 6,
        startDate: range.startDate,
        endDate: range.endDate,
      });
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load cancelled order analytics.",
  });

  const mostAdjustedQuery = useAppQuery<DashboardApiEnvelope<unknown>, Error>({
    queryKey: ["dashboard", "most-adjusted", activeWarehouseId],
    queryFn: function queryMostAdjusted() {
      return dashboardRoutes.getMostAdjustedProducts({
        warehouseId: activeWarehouseId as string,
        limit: 6,
      });
    },
    enabled: Boolean(activeWarehouseId),
    errorMessage: "Unable to load adjusted product analytics.",
  });

  if (warehousesQuery.isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!warehouses.length) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        <Empty description="No warehouse found for dashboard" />
      </main>
    );
  }

  const stats = extractStats(statsQuery.data?.data);
  const categoryData = extractInventoryCategoryChartData(
    inventoryCategoryQuery.data?.data,
  );
  const comparisonData = extractProductTransactionSeries(
    productTransactionQuery.data?.data,
  );
  const issueSeriesData = extractIssueSeriesData(
    cancelledOrdersQuery.data?.data,
    mostAdjustedQuery.data?.data,
  );
  const topSellingRows = extractTopSellingRows(topSellingQuery.data?.data);
  const lowStockRows = extractRows(lowStockQuery.data?.data);

  return (
    <>
      <DashboardTopbar
        warehouses={warehouses}
        selectedWarehouseId={activeWarehouseId}
        onChangeWarehouse={setSelectedWarehouseId}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <DashboardStatCard
            title="Total Sales"
            value={`$${stats.totalSales.toLocaleString()}`}
            trend={`${stats.saleQuantity} qty`}
            highlighted
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <DashboardStatCard
            title="Total Purchase"
            value={`$${stats.totalPurchase.toLocaleString()}`}
            trend={`${stats.purchaseQuantity} qty`}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <DashboardStatCard
            title="Inventory Quantity"
            value={stats.inventoryQuantity}
            trend="Current stock"
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <DashboardStatCard
            title="Today's Shipment"
            value={stats.todayShipmentQuantity}
            trend="Today"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
        <Col xs={24} xl={14}>
          <DashboardCategoryChart data={categoryData} />
        </Col>
        <Col xs={24} xl={10}>
          <DashboardComparisonChart data={comparisonData} />
        </Col>
        <Col xs={24} xl={14}>
          <DashboardIssuesChart data={issueSeriesData} />
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
    </>
  );
}
