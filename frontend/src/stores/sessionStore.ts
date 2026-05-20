import { create } from "zustand";
import { CustomerSession } from "../types/api";

const storageKey = "barbet-customer-session";

interface SessionState {
  session: CustomerSession | null;
  setSession: (session: CustomerSession | null) => void;
  hydrate: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => {
    if (session) {
      localStorage.setItem(storageKey, JSON.stringify(session));
    } else {
      localStorage.removeItem(storageKey);
    }
    set({ session });
  },
  hydrate: () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    set({ session: JSON.parse(raw) as CustomerSession });
  },
}));
