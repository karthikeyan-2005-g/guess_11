import { create } from 'zustand';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import socketService from '../services/socketService';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  intendedRedirectUrl: string | null;
  setIntendedRedirectUrl: (url: string | null) => void;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  guestLogin: (nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('gte_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('gte_access_token'),
  refreshToken: localStorage.getItem('gte_refresh_token'),
  isAuthenticated: !!localStorage.getItem('gte_access_token'),
  isLoading: false,
  intendedRedirectUrl: localStorage.getItem('gte_intended_url') || null,

  setIntendedRedirectUrl: (url: string | null) => {
    if (url) {
      localStorage.setItem('gte_intended_url', url);
    } else {
      localStorage.removeItem('gte_intended_url');
    }
    set({ intendedRedirectUrl: url });
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(credentials);
      if (!res?.data?.user || !res?.data?.tokens) {
        throw new Error(res?.message || 'Server returned an invalid response. Please verify connection.');
      }
      const { user, tokens } = res.data;

      localStorage.setItem('gte_access_token', tokens.accessToken);
      localStorage.setItem('gte_refresh_token', tokens.refreshToken);
      localStorage.setItem('gte_user', JSON.stringify(user));

      socketService.updateAuthToken(tokens.accessToken);

      set({
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authService.register(data);
      if (!res?.data?.user || !res?.data?.tokens) {
        throw new Error(res?.message || 'Registration failed. Server returned an invalid response.');
      }
      const { user, tokens } = res.data;

      localStorage.setItem('gte_access_token', tokens.accessToken);
      localStorage.setItem('gte_refresh_token', tokens.refreshToken);
      localStorage.setItem('gte_user', JSON.stringify(user));

      socketService.updateAuthToken(tokens.accessToken);

      set({
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  guestLogin: async (nickname?: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.guestLogin(nickname);
      if (!res?.data?.user || !res?.data?.tokens) {
        throw new Error(res?.message || 'Guest login failed.');
      }
      const { user, tokens } = res.data;

      localStorage.setItem('gte_access_token', tokens.accessToken);
      localStorage.setItem('gte_refresh_token', tokens.refreshToken);
      localStorage.setItem('gte_user', JSON.stringify(user));

      socketService.updateAuthToken(tokens.accessToken);

      set({
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      socketService.disconnect();
      localStorage.removeItem('gte_access_token');
      localStorage.removeItem('gte_refresh_token');
      localStorage.removeItem('gte_user');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('gte_access_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      socketService.updateAuthToken(token);
      const profile = await authService.getProfile();
      localStorage.setItem('gte_user', JSON.stringify(profile.user));
      set({ user: profile.user, isAuthenticated: true });
    } catch (err) {
      // token may be invalid
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  updateUser: (updated) => {
    const current = get().user;
    if (current) {
      const nextUser = { ...current, ...updated };
      localStorage.setItem('gte_user', JSON.stringify(nextUser));
      set({ user: nextUser });
    }
  },
}));
