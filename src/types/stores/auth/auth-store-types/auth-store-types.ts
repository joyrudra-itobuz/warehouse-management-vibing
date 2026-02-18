import type { AuthUserResponse } from "@/types/apis/auth/auth-response-types/auth-response-types";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  user: AuthUserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  isAuthenticated: boolean;
};

export type AuthActions = {
  setAuthSession: (tokens: AuthTokens, user: AuthUserResponse | null) => void;
  setUser: (user: AuthUserResponse | null) => void;
  clearAuthSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export type AuthStore = AuthState & AuthActions;
