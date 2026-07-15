import { create } from "zustand";
import type { User } from "@/types/domain";

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};

const STORAGE_KEY = "pulseboard-auth";

const defaultUser = (email: string, name = "Maya Johnson"): User => ({
  id: 1,
  name,
  email,
  role: "Product Analytics Lead",
  location: "Lagos, Nigeria",
  company: "PulseBoard Inc.",
  avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Maya%20Johnson"
});

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pick<AuthState, "user" | "token">) : null;
  } catch {
    return null;
  }
};

const persistAuth = (user: User | null, token: string | null) => {
  if (!user || !token) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
};

const storedAuth = readStoredAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedAuth?.user ?? null,
  token: storedAuth?.token ?? null,
  login: async ({ email }) => {
    const user = defaultUser(email);
    const token = crypto.randomUUID();
    persistAuth(user, token);
    set({ user, token });
  },
  register: async ({ email, name }) => {
    const user = defaultUser(email, name);
    const token = crypto.randomUUID();
    persistAuth(user, token);
    set({ user, token });
  },
  logout: () => {
    persistAuth(null, null);
    set({ user: null, token: null });
  },
  updateUser: (user) => {
    persistAuth(user, get().token);
    set({ user });
  }
}));
