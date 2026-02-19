export type InventoryApiEnvelope<TData = unknown> = {
  message: string;
  success: boolean;
  data: TData;
};

export type InventorySortOption =
  | "name_asc"
  | "name_desc"
  | "category_asc"
  | "category_desc"
  | "latest"
  | "quantity_asc"
  | "quantity_desc";

export type InventoryProductQueryParams = {
  search?: string;
  category?: string;
  sort?: InventorySortOption;
  page?: number;
  limit?: number;
};

export type WarehouseItem = {
  id: string;
  name: string;
};

export type InventoryProductRow = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
};

export type InventoryProductDetails = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  markup: number;
  quantity?: number;
  limit?: number;
  status: string;
  images: string[];
};
