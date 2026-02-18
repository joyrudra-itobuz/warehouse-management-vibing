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

const dashboardRoutes = {
  getWarehouses,
  getTransactionStats,
  getLowStockProducts,
  getTopSellingProducts,
  getInventoryByCategory,
  getProductComparisonHistory,
};

export default dashboardRoutes;
