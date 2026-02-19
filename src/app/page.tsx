"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spin } from "antd";

import { useAuthStore } from "@/stores/auth";

export default function HomePage() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/auth/login");
  }, [hasHydrated, isAuthenticated, router]);

  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
      <Spin size="large" />
    </Flex>
  );
}
