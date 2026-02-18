import type { ReactNode } from "react";

import ProtectedRouteGuard from "@/components/auth/common/protected-route-guard/protected-route-guard";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <ProtectedRouteGuard>{children}</ProtectedRouteGuard>;
}
