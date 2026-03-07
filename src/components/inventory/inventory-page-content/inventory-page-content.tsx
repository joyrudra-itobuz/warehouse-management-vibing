"use client";

import { useMemo, useState } from "react";
import { Empty, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useQueryClient } from "@tanstack/react-query";

import InventoryTopbar from "@/components/inventory/layout/inventory-topbar/inventory-topbar";
import InventoryProductDetailsModal, {
  type InventoryProductFormValues,
} from "../modals/inventory-product-details-modal/inventory-product-details-modal";
import InventoryProductsTable from "@/components/inventory/tables/inventory-products-table/inventory-products-table";
import useAppMutation from "@/hooks/common/use-app-mutation/use-app-mutation";
import useAppQuery from "@/hooks/common/use-app-query/use-app-query";
import { inventoryRoutes } from "@/lib/apis/routes";
import type {
  InventoryApiEnvelope,
  InventoryProductDetails,
  InventoryProductRow,
  InventoryProductUpdatePayload,
  ProductVariant,
  WarehouseItem,
} from "@/types/apis/inventory/inventory-response-types/inventory-response-types";

type InventoryTabKey = "all" | "warehouse" | "archived";

type UpdateProductMutationVariables = {
  productId: string;
  payload: InventoryProductUpdatePayload;
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
      const nestedProduct =
        record.product && typeof record.product === "object"
          ? (record.product as Record<string, unknown>)
          : null;
      const source = nestedProduct ?? record;

      // variantCount is provided directly by the API on the product object
      const variantCount = toNumber(
        source.variantCount ?? record.variantCount ?? 0,
      );

      return {
        id: String(
          source._id ??
            record.productId ??
            record._id ??
            record.id ??
            `product-${index}`,
        ),
        name: String(
          source.name ?? record.productName ?? `Product ${index + 1}`,
        ),
        category: String(source.category ?? record.category ?? "Uncategorized"),
        quantity: toNumber(
          record.totalQuantity ??
            record.quantity ??
            record.stock ??
            record.totalSoldQuantity ??
            record.availableQuantity ??
            source.quantity,
        ),
        variantCount,
        priceRange: null, // populated via the variants detail query when modal opens
        status: Boolean(source.isArchived ?? record.isArchived)
          ? "Archived"
          : "Active",
      };
    })
    .filter(function isProduct(value): value is InventoryProductRow {
      return value !== null;
    });
}

function extractProductVariants(data: unknown): ProductVariant[] {
  return toArray(data)
    .map(function mapVariant(item, index) {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;

      const rawAttributes =
        record.attributes && typeof record.attributes === "object"
          ? (record.attributes as Record<string, unknown>)
          : {};

      const productImage = Array.isArray(record.productImage)
        ? record.productImage
            .filter(function filterStr(v) {
              return typeof v === "string";
            })
            .map(String)
        : [];

      return {
        id: String(record._id ?? record.id ?? `variant-${index}`),
        sku: record.sku ? String(record.sku) : undefined,
        attributes: rawAttributes,
        price: toNumber(record.price),
        markup: toNumber(record.markup),
        productImage,
      };
    })
    .filter(function isVariant(value): value is ProductVariant {
      return value !== null;
    });
}

function extractProductDetails(data: unknown): InventoryProductDetails | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const source =
    record.product && typeof record.product === "object"
      ? (record.product as Record<string, unknown>)
      : record;

  return {
    id: String(source._id ?? record.productId ?? record._id ?? ""),
    name: String(source.name ?? "Unknown Product"),
    category: String(source.category ?? "Uncategorized"),
    description: String(source.description ?? ""),
    brand: source.brand ? String(source.brand) : undefined,
    label: source.label ? String(source.label) : undefined,
    variantAttributes:
      source.variantAttributes &&
      typeof source.variantAttributes === "object" &&
      !Array.isArray(source.variantAttributes)
        ? (source.variantAttributes as Record<string, unknown>)
        : undefined,
    isArchived: Boolean(source.isArchived ?? record.isArchived),
    quantity: toNumber(record.quantity) || undefined,
    limit: toNumber(record.limit) || undefined,
    status: Boolean(source.isArchived ?? record.isArchived)
      ? "Archived"
      : "Active",
    variants: [],
  };
}

export default function InventoryPageContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<InventoryTabKey>("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
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

  const productDetailsQuery = useAppQuery<InventoryApiEnvelope<unknown>, Error>(
    {
      queryKey: ["inventory", "product-details", selectedProductId],
      queryFn: function queryProductDetails() {
        return inventoryRoutes.getProductDetails(selectedProductId as string);
      },
      enabled: Boolean(selectedProductId),
      errorMessage: "Unable to load product details.",
    },
  );

  const productVariantsQuery = useAppQuery<
    InventoryApiEnvelope<unknown>,
    Error
  >({
    queryKey: ["inventory", "product-variants", selectedProductId],
    queryFn: function queryProductVariants() {
      return inventoryRoutes.getProductVariants(selectedProductId as string);
    },
    enabled: Boolean(selectedProductId),
    errorMessage: "Unable to load product variants.",
  });

  const updateProductMutation = useAppMutation<
    InventoryApiEnvelope<unknown>,
    Error,
    UpdateProductMutationVariables
  >({
    mutationKey: ["inventory", "update-product"],
    mutationFn: function mutationFn(variables) {
      return inventoryRoutes.updateProduct(
        variables.productId,
        variables.payload,
      );
    },
    options: {
      successMessage: "Product updated successfully.",
      onSuccess: function onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["inventory", "all-products"],
        });
        queryClient.invalidateQueries({
          queryKey: ["inventory", "archived-products"],
        });
        queryClient.invalidateQueries({
          queryKey: ["inventory", "warehouse-products"],
        });
        queryClient.invalidateQueries({
          queryKey: ["inventory", "product-details"],
        });
      },
    },
  });

  const handleSubmitProduct = async function handleSubmitProduct(
    values: InventoryProductFormValues,
  ) {
    if (!selectedProductId) {
      return;
    }

    const payload: InventoryProductUpdatePayload = {
      id: selectedProductId,
      name: values.name,
      category: values.category,
      description: values.description,
      isArchived: Boolean(values.isArchived),
    };

    updateProductMutation.mutate(
      {
        productId: selectedProductId,
        payload,
      },
      {
        onSuccess: function onSuccess() {
          setSelectedProductId(null);
        },
      },
    );
  };

  const isBootstrapping = warehousesQuery.isLoading;

  if (!isBootstrapping && !warehouses.length) {
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
  const selectedProductDetails = extractProductDetails(
    productDetailsQuery.data?.data,
  );
  const selectedProductVariants = extractProductVariants(
    productVariantsQuery.data?.data,
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "All Products",
      children: (
        <InventoryProductsTable
          title="All Products"
          data={isBootstrapping ? [] : allProducts}
          loading={isBootstrapping || allProductsQuery.isLoading}
          onRowClick={setSelectedProductId}
        />
      ),
    },
    {
      key: "warehouse",
      label: "Warehouse Products",
      children: (
        <InventoryProductsTable
          title="Warehouse Based Products"
          data={isBootstrapping ? [] : warehouseProducts}
          loading={isBootstrapping || warehouseProductsQuery.isLoading}
          onRowClick={setSelectedProductId}
        />
      ),
    },
    {
      key: "archived",
      label: "Archived Products",
      children: (
        <InventoryProductsTable
          title="Archived Products"
          data={isBootstrapping ? [] : archivedProducts}
          loading={isBootstrapping || archivedProductsQuery.isLoading}
          onRowClick={setSelectedProductId}
        />
      ),
    },
  ];

  return (
    <>
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

      <InventoryProductDetailsModal
        open={Boolean(selectedProductId)}
        onClose={function onCloseModal() {
          setSelectedProductId(null);
        }}
        loading={productDetailsQuery.isLoading}
        submitting={updateProductMutation.isPending}
        product={selectedProductDetails}
        variants={selectedProductVariants}
        variantsLoading={productVariantsQuery.isLoading}
        onSubmit={handleSubmitProduct}
      />
    </>
  );
}
