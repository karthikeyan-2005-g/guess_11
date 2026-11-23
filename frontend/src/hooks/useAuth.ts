import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, login, register, logout, checkAuth, updateUser } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
  };
}
