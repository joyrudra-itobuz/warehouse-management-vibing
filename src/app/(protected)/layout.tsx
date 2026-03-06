"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { Layout } from "antd";

import ProtectedRouteGuard from "@/components/auth/common/protected-route-guard/protected-route-guard";
import DashboardSidebar from "@/components/dashboard/layout/dashboard-sidebar/dashboard-sidebar";
import ChatSidebar from "@/components/ai-chat/chat-sidebar/chat-sidebar";
import { useChatStore } from "@/stores/chat";

type ProtectedLayoutProps = {
  children: ReactNode;
};

const { Content } = Layout;

const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 700;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const isOpen = useChatStore((state) => state.isOpen);
  const panelWidth = useChatStore((state) => state.panelWidth);
  const setPanelWidth = useChatStore((state) => state.setPanelWidth);

  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeMouseDown = useCallback(
    function handleResizeMouseDown(e: React.MouseEvent) {
      e.preventDefault();
      isResizingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = panelWidth;

      const onMouseMove = function onMouseMove(moveEvent: MouseEvent) {
        if (!isResizingRef.current) return;
        // Dragging left increases panel width
        const delta = startXRef.current - moveEvent.clientX;
        const newWidth = Math.min(
          MAX_PANEL_WIDTH,
          Math.max(MIN_PANEL_WIDTH, startWidthRef.current + delta),
        );
        setPanelWidth(newWidth);
      };

      const onMouseUp = function onMouseUp() {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [panelWidth, setPanelWidth],
  );

  return (
    <ProtectedRouteGuard>
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Left navigation sidebar */}
        <DashboardSidebar />

        {/* Main content area */}
        <Layout style={{ flex: 1, minWidth: 0, minHeight: "100vh" }}>
          <Content style={{ padding: 24, overflow: "auto" }}>
            {children}
          </Content>
        </Layout>

        {/* Resizable AI chat side panel */}
        <div
          style={{
            width: isOpen ? panelWidth : 0,
            minWidth: 0,
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.2s ease",
            position: "relative",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/* Drag-to-resize handle — only visible when open */}
          {isOpen ? (
            <div
              role="separator"
              aria-orientation="vertical"
              style={{
                width: 4,
                flexShrink: 0,
                cursor: "col-resize",
                background: "transparent",
                borderLeft: "1px solid rgba(0,0,0,0.08)",
                zIndex: 10,
                transition: "background 0.15s",
              }}
              onMouseDown={handleResizeMouseDown}
              onMouseEnter={function highlight(e) {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(22, 119, 255, 0.3)";
              }}
              onMouseLeave={function unhighlight(e) {
                (e.currentTarget as HTMLDivElement).style.background =
                  "transparent";
              }}
            />
          ) : null}

          {/* Chat panel — always mounted to preserve state */}
          <div
            style={{
              width: panelWidth - 4,
              minWidth: 0,
              height: "100vh",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <ChatSidebar />
          </div>
        </div>
      </Layout>
    </ProtectedRouteGuard>
  );
}
