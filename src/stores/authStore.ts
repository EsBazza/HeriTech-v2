// HeriTech — Zustand Auth Store
// Manages active user role and session state with default fallback.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";

interface AuthState {
  user: User;
  role: Role;
  isLoggedIn: boolean;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USERS[2], // Default to Buyer Alex Chen
      role: "buyer",
      isLoggedIn: true,

      login: (role: Role) => {
        const user = MOCK_USERS.find((u) => u.role === role) ?? MOCK_USERS[0];
        set({ user, role, isLoggedIn: true });
      },

      logout: () => set({ user: MOCK_USERS[2], role: "buyer", isLoggedIn: true }),

      switchRole: (role: Role) => {
        const user = MOCK_USERS.find((u) => u.role === role) ?? MOCK_USERS[0];
        set({ user, role, isLoggedIn: true });
      },
    }),
    { name: "heritech-auth-v2" },
  ),
);
