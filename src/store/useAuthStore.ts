import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "sahip" | "yonetici" | "calisan";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      login: (role) => set({ isAuthenticated: true, role }),
      logout: () => set({ isAuthenticated: false, role: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
