"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spin } from "antd";
import type { ReactNode } from "react";

import { useAuthStore } from "@/stores/auth";

type ProtectedRouteGuardProps = {
  children: ReactNode;
};

export default function ProtectedRouteGuard({
  children,
}: ProtectedRouteGuardProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
