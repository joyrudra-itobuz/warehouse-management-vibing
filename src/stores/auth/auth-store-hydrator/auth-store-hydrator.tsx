"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth";

export default function AuthStoreHydrator() {
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  return null;
}
