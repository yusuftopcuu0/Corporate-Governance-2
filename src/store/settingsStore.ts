import { create } from "zustand";

interface SettingState {
  theme: "light" | "dark";
  language: "tr" | "en";
  name: string;
  email: string;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "tr" | "en") => void;
  updateProfile: (name: string, email: string) => void;
}

export const useSettingsStore = create<SettingState>((set) => ({
  theme: "light",
  language: "en",
  name: "Yusuf Topcu",
  email: "yusuf@gmail.com",
  setTheme: (theme) => set({ theme }),
  setLanguage: (lang) => set({ language: lang }),
  updateProfile: (name, email) => set({ name, email }),
}));
