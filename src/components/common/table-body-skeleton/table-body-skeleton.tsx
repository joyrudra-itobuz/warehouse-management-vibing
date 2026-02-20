"use client";

import { Space } from "antd";

import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";

type TableBodySkeletonProps = {
  rows?: number;
  columns?: number;
};

export default function TableBodySkeleton({
  rows = 6,
  columns = 5,
}: TableBodySkeletonProps) {
  return (
    <AccentSkeletonThemeProvider>
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        {Array.from({ length: rows }).map(function mapRow(_, rowIndex) {
          return (
            <div
              key={`row-${rowIndex}`}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: 12,
                width: "100%",
              }}
            >
              {Array.from({ length: columns }).map(
                function mapColumn(_, colIndex) {
                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={{
                        height: 14,
                        borderRadius: 8,
                        background:
                          colIndex === 0
                            ? "var(--ant-color-fill-secondary)"
                            : "var(--ant-color-fill-content)",
                        opacity: 0.9,
                        animation:
                          "ant-skeleton-loading 1.35s ease-in-out infinite",
                        animationDelay: `${(rowIndex + colIndex) * 0.04}s`,
                      }}
                    />
                  );
                },
              )}
            </div>
          );
        })}
      </Space>
    </AccentSkeletonThemeProvider>
  );
}
