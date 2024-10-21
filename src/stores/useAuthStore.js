
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => user.value !== null);

  const fetchUser = async () => {
    try {
      const response = await AuthService.getAuthUser();
      user.value = response.data;
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      user.value = null;
    }
  };

  const setUser = (userData) => {
    user.value = userData;
  };

  const updateUser = async (userData) => {
    try {
      loading.value = true;
      const response = await AuthService.updateUser(userData);
      user.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating user data';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      loading.value = true;
      const response = await AuthService.updatePassword(passwordData);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating password';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials) => {
    try {
      await AuthService.login(credentials);
      await fetchUser();
    } catch (error) {
      console.error("Login error:", error);
      throw error; 
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      user.value = null;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    setUser,
    login,
    logout,
    updateUser,
    updatePassword,
  };
});
