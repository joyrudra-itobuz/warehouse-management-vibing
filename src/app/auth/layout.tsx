import type { ReactNode } from "react";

import AuthRouteGuard from "@/components/auth/common/auth-route-guard/auth-route-guard";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthRouteGuard>{children}</AuthRouteGuard>;
}
