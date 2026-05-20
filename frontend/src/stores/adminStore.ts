import { create } from "zustand";

const tokenKey = "barbet-admin-token";

interface AdminState {
  token: string | null;
  email: string | null;
  setAuth: (token: string | null, email?: string | null) => void;
  hydrate: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: null,
  email: null,
  setAuth: (token, email = null) => {
    if (token) {
      localStorage.setItem(tokenKey, token);
    } else {
      localStorage.removeItem(tokenKey);
    }
    set({ token, email });
  },
  hydrate: () => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      set({ token, email: "admin@barbet.com" });
    }
  },
}));
