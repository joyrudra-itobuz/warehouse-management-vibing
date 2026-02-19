import request from "@/lib/apis/http/request/request";
import type { DashboardApiEnvelope } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

type TopSellingParams = {
  warehouseId: string;
  limit: number;
};

type ProductComparisonParams = {
  warehouseId: string;
  productA: string;
  productB: string;
};

type CancelledOrdersParams = {
  warehouseId: string;
  startDate: string;
  endDate: string;
  limit: number;
};

type MostAdjustedProductsParams = {
  warehouseId: string;
  limit: number;
};

function toQuery(params: Record<string, string | number>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(function appendQuery([key, value]) {
    query.append(key, String(value));
  });

  return query.toString();
}

function getWarehouses() {
  return request<DashboardApiEnvelope<unknown>>({
    path: "/warehouse/get-warehouses",
    method: "GET",
  });
}

function getTransactionStats(warehouseId: string) {
  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-transaction-stats/${warehouseId}`,
    method: "GET",
  });
}

function getLowStockProducts(warehouseId: string) {
  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-low-stock-products/${warehouseId}`,
    method: "GET",
  });
}

function getTopSellingProducts(params: TopSellingParams) {
  const query = toQuery({ limit: params.limit });

  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-top-selling-products/${params.warehouseId}?${query}`,
    method: "GET",
  });
}

function getInventoryByCategory(warehouseId: string) {
  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-inventory-category/${warehouseId}`,
    method: "GET",
  });
}

function getProductComparisonHistory(params: ProductComparisonParams) {
  const query = toQuery({
    warehouseId: params.warehouseId,
    productA: params.productA,
    productB: params.productB,
  });

  return request<DashboardApiEnvelope<unknown>>({
    path: `/analytics/product-comparison-history?${query}`,
    method: "GET",
  });
}

function getProductTransaction(warehouseId: string) {
  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-product-transaction/${warehouseId}`,
    method: "GET",
  });
}

function getCancelledOrders(params: CancelledOrdersParams) {
  const query = toQuery({
    startDate: params.startDate,
    endDate: params.endDate,
    limit: params.limit,
  });

  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-cancelled-orders/${params.warehouseId}?${query}`,
    method: "GET",
  });
}

function getMostAdjustedProducts(params: MostAdjustedProductsParams) {
  const query = toQuery({
    limit: params.limit,
  });

  return request<DashboardApiEnvelope<unknown>>({
    path: `/dashboard/get-most-adjusted-products/${params.warehouseId}?${query}`,
    method: "GET",
  });
}

const dashboardRoutes = {
  getWarehouses,
  getTransactionStats,
  getLowStockProducts,
  getTopSellingProducts,
  getInventoryByCategory,
  getProductComparisonHistory,
  getProductTransaction,
  getCancelledOrders,
  getMostAdjustedProducts,
};

export default dashboardRoutes;
