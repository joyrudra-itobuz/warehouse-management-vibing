export type DashboardApiEnvelope<TData = unknown> = {
  message: string;
  success: boolean;
  data: TData;
};

export type DashboardKpiItem = {
  key: string;
  label: string;
  value: string | number;
  trend?: string | number;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardSeriesChartPoint = {
  label: string;
  value: number;
  series: string;
};

export type DashboardTableRow = {
  id: string;
  name: string;
  quantity?: number;
  amount?: number;
  status?: string;
};

export type WarehouseItem = {
  id: string;
  name: string;
};
