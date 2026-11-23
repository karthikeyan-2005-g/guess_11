import { apiRequest } from './api';
import { User, UserStatistics } from '../types/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export const authService = {
  async register(data: any): Promise<AuthResponse> {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: any): Promise<AuthResponse> {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('gte_refresh_token');
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      localStorage.removeItem('gte_access_token');
      localStorage.removeItem('gte_refresh_token');
      localStorage.removeItem('gte_user');
    }
  },

  async getProfile(): Promise<{ user: User; statistics: UserStatistics }> {
    const res = await apiRequest('/profile', { method: 'GET' });
    return res.data;
  },

  async updateProfile(data: any): Promise<User> {
    const res = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async changePassword(data: any): Promise<void> {
    await apiRequest('/profile/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async forgotPassword(email: string): Promise<any> {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(data: any): Promise<any> {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
