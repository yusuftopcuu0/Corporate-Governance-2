import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

type Role = "sahip" | "yonetici" | "calisan";

interface User {
  username: string;
  role: Role;
  fullName: string;
  email: string;
}

const PREDEFINED_USERS: User[] = [
  {
    username: "yusuftopcu10",
    role: "sahip",
    fullName: "Yusuf Topcu",
    email: "yusuftopcu10@gmail.com",
  },
  {
    username: "kadir98",
    role: "sahip",
    fullName: "Kadir Topcu",
    email: "kadir98@gmail.com",
  },
  {
    username: "ahmet99",
    role: "yonetici",
    fullName: "Ahmet Güçlü",
    email: "ahmet99@gmail.com",
  },
  {
    username: "zeynnep1",
    role: "yonetici",
    fullName: "Zeynep Güneş",
    email: "zeynnep1@gmail.com",
  },
  {
    username: "kerem23",
    role: "calisan",
    fullName: "Kerem Demir",
    email: "kerem23@gmail.com",
  },
  {
    username: "sude.e2",
    role: "calisan",
    fullName: "Sude Ekin",
    email: "sude.e2@gmail.com",
  },
  {
    username: "eliff34",
    role: "calisan",
    fullName: "Elif Bulut",
    email: "eliff34@gmail.com",
  },
  {
    username: "ayse12",
    role: "calisan",
    fullName: "Ayşe Demir",
    email: "ayse12@gmail.com",
  },
  {
    username: "zeynep45",
    role: "calisan",
    fullName: "Zeynep Şahin",
    email: "zeynep45@gmail.com",
  },
  {
    username: "hakan01",
    role: "calisan",
    fullName: "Hakan Kurt",
    email: "hakan01@gmail.com",
  },
  {
    username: "burcu67",
    role: "calisan",
    fullName: "Burcu Durmuş",
    email: "burcu67@gmail.com",
  },
  {
    username: "fatma24",
    role: "calisan",
    fullName: "Fatma Yılmaz",
    email: "fatma24@gmail.com",
  },
  {
    username: "sema12",
    role: "calisan",
    fullName: "Sema Duman",
    email: "sema12@gmail.com",
  },
];

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string) => boolean;
  logout: () => void;
  getUsersByRole: (role: Role) => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username) => {
        const user = PREDEFINED_USERS.find((u) => u.username === username);
        if (user) {
          set({ isAuthenticated: true, user });
          toast.success(`Hoş geldiniz, ${user.fullName}`);
          return true;
        }
        toast.error("Geçersiz kullanıcı adı");
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
        toast.info("Çıkış yapıldı");
      },
      getUsersByRole: (role) => {
        return PREDEFINED_USERS.filter((user) => user.role === role);
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
