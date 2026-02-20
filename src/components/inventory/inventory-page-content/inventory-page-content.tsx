"use client";

import { useMemo, useState } from "react";
import { Empty, Tabs } from "antd";
import type { TabsProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useQueryClient } from "@tanstack/react-query";

import AppLoader from "@/components/common/app-loader/app-loader";
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise(function resolveFileToDataUrl(resolve, reject) {
    const reader = new FileReader();

    reader.onload = function onLoad() {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      resolve("");
    };

    reader.onerror = function onError() {
      reject(new Error("Unable to read file"));
    };

    reader.readAsDataURL(file);
  });
}

async function normalizeProductImages(fileList: UploadFile[] | undefined) {
  if (!fileList || fileList.length === 0) {
    return [] as string[];
  }

  const normalized = await Promise.all(
    fileList.map(async function mapFile(file) {
      if (typeof file.url === "string" && file.url.trim()) {
        return file.url;
      }

      if (typeof file.thumbUrl === "string" && file.thumbUrl.trim()) {
        return file.thumbUrl;
      }

      if (file.originFileObj instanceof File) {
        return fileToDataUrl(file.originFileObj);
      }

      return "";
    }),
  );

  return normalized.filter(function filterImage(value) {
    return value.length > 0;
  });
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
        price: toNumber(
          source.price ?? record.price ?? record.sellingPrice ?? 0,
        ),
        status: Boolean(source.isArchived ?? record.isArchived)
          ? "Archived"
          : "Active",
      };
    })
    .filter(function isProduct(value): value is InventoryProductRow {
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

  const images = Array.isArray(source.productImage)
    ? source.productImage
        .filter(function filterImage(value) {
          return typeof value === "string";
        })
        .map(function mapImage(value) {
          return String(value);
        })
    : [];

  return {
    id: String(source._id ?? record.productId ?? record._id ?? ""),
    name: String(source.name ?? "Unknown Product"),
    category: String(source.category ?? "Uncategorized"),
    description: String(source.description ?? ""),
    price: toNumber(source.price),
    markup: toNumber(source.markup),
    isArchived: Boolean(source.isArchived ?? record.isArchived),
    quantity: toNumber(record.quantity),
    limit: toNumber(record.limit),
    status: Boolean(source.isArchived ?? record.isArchived)
      ? "Archived"
      : "Active",
    images,
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

    const productImage = await normalizeProductImages(values.productImages);

    const payload: InventoryProductUpdatePayload = {
      id: selectedProductId,
      name: values.name,
      category: values.category,
      description: values.description,
      price: toNumber(values.price),
      markup: toNumber(values.markup),
      isArchived: Boolean(values.isArchived),
      productImage,
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

  if (warehousesQuery.isLoading) {
    return <AppLoader minHeight="calc(100vh - 48px)" />;
  }

  if (!warehouses.length) {
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

  const productQueryIsLoading =
    (activeTab === "all" && allProductsQuery.isLoading) ||
    (activeTab === "warehouse" && warehouseProductsQuery.isLoading) ||
    (activeTab === "archived" && archivedProductsQuery.isLoading);

  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "All Products",
      children: (
        <InventoryProductsTable
          title="All Products"
          data={allProducts}
          loading={false}
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
          data={warehouseProducts}
          loading={false}
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
          data={archivedProducts}
          loading={false}
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
        items={
          productQueryIsLoading
            ? [
                {
                  key: activeTab,
                  label:
                    activeTab === "all"
                      ? "All Products"
                      : activeTab === "warehouse"
                        ? "Warehouse Products"
                        : "Archived Products",
                  children: <AppLoader minHeight="calc(100vh - 220px)" />,
                },
              ]
            : tabItems
        }
      />

      <InventoryProductDetailsModal
        open={Boolean(selectedProductId)}
        onClose={function onCloseModal() {
          setSelectedProductId(null);
        }}
        loading={productDetailsQuery.isLoading}
        submitting={updateProductMutation.isPending}
        product={selectedProductDetails}
        onSubmit={handleSubmitProduct}
      />
    </>
  );
}
