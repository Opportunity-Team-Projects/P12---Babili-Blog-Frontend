
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  const isAuthenticated = computed(() => user.value !== null);

  const fetchUser = async () => {
    try {
      const response = await AuthService.getAuthUser();
      user.value = response.data;
    } catch (error) {
      user.value = null;
    }
  };

  const setUser = (userData) => {
    user.value = userData;
  };

  const logout = async () => {
    await AuthService.logout();
    user.value = null;
  };

  return {
    user,
    isAuthenticated,
    fetchUser,
    setUser,
    logout,
  };
});
