import { create } from "zustand";

import type {
  AuthState,
  AuthStore,
  AuthTokens,
} from "@/types/stores/auth/auth-store-types/auth-store-types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const getStoredToken = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(key);
};

const setStoredToken = (key: string, value: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, value);
};

const removeStoredToken = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(key);
};

const getInitialTokens = () => {
  const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
  const refreshToken = getStoredToken(REFRESH_TOKEN_KEY);

  return {
    accessToken,
    refreshToken,
  };
};

const initialTokens = getInitialTokens();

const initialState: AuthState = {
  user: null,
  accessToken: initialTokens.accessToken,
  refreshToken: initialTokens.refreshToken,
  hasHydrated: false,
  isAuthenticated: Boolean(
    initialTokens.accessToken && initialTokens.refreshToken,
  ),
};

export const useAuthStore = create<AuthStore>()((set) => ({
  ...initialState,
  setAuthSession: (tokens: AuthTokens, user) => {
    setStoredToken(ACCESS_TOKEN_KEY, tokens.accessToken);
    setStoredToken(REFRESH_TOKEN_KEY, tokens.refreshToken);

    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
      isAuthenticated: Boolean(tokens.accessToken && tokens.refreshToken),
    });
  },
  setUser: (user) => {
    set({ user });
  },
  clearAuthSession: () => {
    removeStoredToken(ACCESS_TOKEN_KEY);
    removeStoredToken(REFRESH_TOKEN_KEY);

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
  setHasHydrated: (value) => {
    set({ hasHydrated: value });
  },
}));
