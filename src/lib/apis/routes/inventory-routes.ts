import request from "@/lib/apis/http/request/request";
import type {
  InventoryApiEnvelope,
  InventoryProductQueryParams,
} from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

function toQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(function appendQuery([key, value]) {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

function getAllProducts(params: InventoryProductQueryParams = {}) {
  const query = toQuery({
    search: params.search,
    category: params.category,
    sort: params.sort,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  return request<InventoryApiEnvelope<unknown>>({
    path: `/product?${query}`,
    method: "GET",
  });
}

function getArchivedProducts(params: InventoryProductQueryParams = {}) {
  const query = toQuery({
    search: params.search,
    category: params.category,
    sort: params.sort,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  return request<InventoryApiEnvelope<unknown>>({
    path: `/product/archived/all?${query}`,
    method: "GET",
  });
}

function getWarehouseProducts(warehouseId: string) {
  return request<InventoryApiEnvelope<unknown>>({
    path: `/quantity/warehouse-specific-products/${warehouseId}`,
    method: "GET",
  });
}

function getProductDetails(productId: string) {
  return request<InventoryApiEnvelope<unknown>>({
    path: `/product/qr/${productId}`,
    method: "POST",
  });
}

function getWarehouses() {
  return request<InventoryApiEnvelope<unknown>>({
    path: "/warehouse/get-warehouses",
    method: "GET",
  });
}

const inventoryRoutes = {
  getAllProducts,
  getArchivedProducts,
  getWarehouseProducts,
  getProductDetails,
  getWarehouses,
};

export default inventoryRoutes;
