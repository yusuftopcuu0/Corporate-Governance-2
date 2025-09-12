import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

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
      login: (role) => {
        set({ isAuthenticated: true, role });
        toast.success("Giriş Yapıldı");
      },
      logout: () => {
        set({ isAuthenticated: false, role: null });
        toast.error("Çıkış Yapıldı");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
