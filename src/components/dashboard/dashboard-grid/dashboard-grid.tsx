"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import type { ResponsiveLayouts, Layout } from "react-grid-layout";
import { theme } from "antd";
import { DragOutlined } from "@ant-design/icons";

import DashboardStatCard from "@/components/dashboard/widgets/dashboard-stat-card/dashboard-stat-card";
import DashboardCategoryChart from "@/components/dashboard/charts/dashboard-category-chart/dashboard-category-chart";
import DashboardComparisonChart from "@/components/dashboard/charts/dashboard-comparison-chart/dashboard-comparison-chart";
import DashboardIssuesChart from "@/components/dashboard/charts/dashboard-issues-chart/dashboard-issues-chart";
import DashboardTopProductsTable from "@/components/dashboard/tables/dashboard-top-products-table/dashboard-top-products-table";
import DashboardLowStockTable from "@/components/dashboard/tables/dashboard-low-stock-table/dashboard-low-stock-table";
import type {
  DashboardChartPoint,
  DashboardSeriesChartPoint,
  DashboardTableRow,
} from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const ROW_HEIGHT = 60;
const LAYOUT_KEY = "vault_dashboard_layouts_v1";

const DEFAULT_LAYOUTS: ResponsiveLayouts<string> = {
  lg: [
    { i: "stat-sales", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: "stat-purchase", x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: "stat-inventory", x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: "stat-shipment", x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: "category-chart", x: 0, y: 3, w: 7, h: 7, minW: 3, minH: 4 },
    { i: "comparison-chart", x: 7, y: 3, w: 5, h: 7, minW: 3, minH: 4 },
    { i: "issues-chart", x: 0, y: 10, w: 7, h: 7, minW: 3, minH: 4 },
    { i: "top-products", x: 0, y: 17, w: 7, h: 8, minW: 3, minH: 5 },
    { i: "low-stock", x: 7, y: 17, w: 5, h: 8, minW: 3, minH: 5 },
  ],
  md: [
    { i: "stat-sales", x: 0, y: 0, w: 6, h: 3, minW: 2, minH: 2 },
    { i: "stat-purchase", x: 6, y: 0, w: 6, h: 3, minW: 2, minH: 2 },
    { i: "stat-inventory", x: 0, y: 3, w: 6, h: 3, minW: 2, minH: 2 },
    { i: "stat-shipment", x: 6, y: 3, w: 6, h: 3, minW: 2, minH: 2 },
    { i: "category-chart", x: 0, y: 6, w: 12, h: 7, minW: 3, minH: 4 },
    { i: "comparison-chart", x: 0, y: 13, w: 12, h: 7, minW: 3, minH: 4 },
    { i: "issues-chart", x: 0, y: 20, w: 12, h: 7, minW: 3, minH: 4 },
    { i: "top-products", x: 0, y: 27, w: 12, h: 8, minW: 3, minH: 5 },
    { i: "low-stock", x: 0, y: 35, w: 12, h: 8, minW: 3, minH: 5 },
  ],
};

function loadLayouts(): ResponsiveLayouts<string> {
  if (typeof window === "undefined") return DEFAULT_LAYOUTS;
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    return raw
      ? (JSON.parse(raw) as ResponsiveLayouts<string>)
      : DEFAULT_LAYOUTS;
  } catch {
    return DEFAULT_LAYOUTS;
  }
}

function saveLayouts(layouts: ResponsiveLayouts<string>): void {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layouts));
  } catch {
    /* storage full — ignore */
  }
}

// ─── Per-item wrapper ────────────────────────────────────────────────────────

type GridItemWrapperProps = {
  children: ReactNode;
};

function GridItemWrapper({ children }: GridItemWrapperProps) {
  const { token } = theme.useToken();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ height: "100%", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle — fades in on hover */}
      <div
        className="grid-drag-handle"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 20,
          cursor: "grab",
          padding: "4px 6px",
          borderRadius: 6,
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: token.boxShadow,
          lineHeight: 1,
          userSelect: "none",
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 0.18s ease",
        }}
        title="Drag to move"
      >
        <DragOutlined
          style={{ fontSize: 12, color: token.colorTextSecondary }}
        />
      </div>

      {/* Hover outline — indicates the item is interactive */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: 12,
          outline: hovered
            ? `2px dashed ${token.colorBorderSecondary}`
            : "2px dashed transparent",
          zIndex: 1,
          transition: "outline-color 0.18s ease",
        }}
      />

      {children}
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

type Stats = {
  totalSales: number;
  totalPurchase: number;
  inventoryQuantity: number;
  todayShipmentQuantity: number;
  saleQuantity: number;
  purchaseQuantity: number;
};

type DashboardGridProps = {
  stats: Stats;
  statsLoading: boolean;
  categoryData: DashboardChartPoint[];
  comparisonData: DashboardSeriesChartPoint[];
  issueSeriesData: DashboardSeriesChartPoint[];
  topSellingRows: DashboardTableRow[];
  topSellingLoading: boolean;
  lowStockRows: DashboardTableRow[];
  lowStockLoading: boolean;
};

// ─── Root component ──────────────────────────────────────────────────────────

export default function DashboardGrid({
  stats,
  statsLoading,
  categoryData,
  comparisonData,
  issueSeriesData,
  topSellingRows,
  topSellingLoading,
  lowStockRows,
  lowStockLoading,
}: DashboardGridProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const [layouts, setLayouts] =
    useState<ResponsiveLayouts<string>>(loadLayouts);

  // Debounced auto-save: persists 3 s after the last layout change
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(function cleanup() {
    return function () {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleLayoutChange = useCallback(function handleLayoutChange(
    _layout: Layout,
    allLayouts: ResponsiveLayouts<string>,
  ) {
    setLayouts(allLayouts);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(function persistLayout() {
      saveLayouts(allLayouts);
      saveTimerRef.current = null;
    }, 3000);
  }, []);

  return (
    <div>
      {/* Grid — useContainerWidth measures the actual container via ResizeObserver */}
      <div ref={containerRef}>
        {mounted ? (
          <ResponsiveGridLayout
            className="vault-dashboard-grid"
            layouts={layouts}
            width={width}
            breakpoints={{ lg: 1100, md: 0 }}
            cols={{ lg: 12, md: 12 }}
            rowHeight={ROW_HEIGHT}
            dragConfig={{ enabled: true, handle: ".grid-drag-handle" }}
            resizeConfig={{ enabled: true, handles: ["se"] as const }}
            onLayoutChange={handleLayoutChange}
            margin={[16, 16]}
            containerPadding={[0, 0]}
          >
            <div key="stat-sales">
              <GridItemWrapper>
                <DashboardStatCard
                  title="Total Sales"
                  value={`$${stats.totalSales.toLocaleString()}`}
                  trend={`${stats.saleQuantity} qty`}
                  highlighted
                  loading={statsLoading}
                />
              </GridItemWrapper>
            </div>

            <div key="stat-purchase">
              <GridItemWrapper>
                <DashboardStatCard
                  title="Total Purchase"
                  value={`$${stats.totalPurchase.toLocaleString()}`}
                  trend={`${stats.purchaseQuantity} qty`}
                  loading={statsLoading}
                />
              </GridItemWrapper>
            </div>

            <div key="stat-inventory">
              <GridItemWrapper>
                <DashboardStatCard
                  title="Inventory Quantity"
                  value={stats.inventoryQuantity}
                  trend="Current stock"
                  loading={statsLoading}
                />
              </GridItemWrapper>
            </div>

            <div key="stat-shipment">
              <GridItemWrapper>
                <DashboardStatCard
                  title="Today's Shipment"
                  value={stats.todayShipmentQuantity}
                  trend="Today"
                  loading={statsLoading}
                />
              </GridItemWrapper>
            </div>

            <div key="category-chart">
              <GridItemWrapper>
                <DashboardCategoryChart data={categoryData} />
              </GridItemWrapper>
            </div>

            <div key="comparison-chart">
              <GridItemWrapper>
                <DashboardComparisonChart data={comparisonData} />
              </GridItemWrapper>
            </div>

            <div key="issues-chart">
              <GridItemWrapper>
                <DashboardIssuesChart data={issueSeriesData} />
              </GridItemWrapper>
            </div>

            <div key="top-products">
              <GridItemWrapper>
                <DashboardTopProductsTable
                  data={topSellingRows}
                  loading={topSellingLoading}
                />
              </GridItemWrapper>
            </div>

            <div key="low-stock">
              <GridItemWrapper>
                <DashboardLowStockTable
                  data={lowStockRows}
                  loading={lowStockLoading}
                />
              </GridItemWrapper>
            </div>
          </ResponsiveGridLayout>
        ) : null}
      </div>
    </div>
  );
}
