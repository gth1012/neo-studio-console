import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('neo-token'),
  user: JSON.parse(localStorage.getItem('neo-user') || 'null'),

  login: (token: string, user: User) => {
    localStorage.setItem('neo-token', token);
    localStorage.setItem('neo-user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('neo-token');
    localStorage.removeItem('neo-user');
    set({ token: null, user: null });
  },

  isLoggedIn: () => !!get().token,
}));
