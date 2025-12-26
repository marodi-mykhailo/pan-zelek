import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
        // Store token in localStorage for API calls
        localStorage.setItem('authToken', token);
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('authToken');
      },

      isAuthenticated: () => {
        return get().user !== null && get().token !== null;
      },

      isAdmin: () => {
        return get().user?.role === 'ADMIN';
      },
    }),
    {
      name: 'pan-zelek-auth',
    }
  )
);
