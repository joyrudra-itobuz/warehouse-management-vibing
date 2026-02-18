import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AuthState,
  AuthStore,
  AuthTokens,
} from "@/types/stores/auth/auth-store-types/auth-store-types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  hasHydrated: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthSession: (tokens: AuthTokens, user) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: Boolean(tokens.accessToken),
        });
      },
      setUser: (user) => {
        set({ user });
      },
      clearAuthSession: () => {
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
    }),
    {
      name: "wm-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
