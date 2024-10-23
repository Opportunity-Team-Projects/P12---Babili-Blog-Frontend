
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const profileImage = ref('');

  const isAuthenticated = computed(() => user.value !== null);

  const fetchUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await AuthService.getAuthUser();
      user.value = response.data;

      // Überprüfen, ob ein Profilbild existiert
      if (user.value && user.value.user && user.value.user.profile_pic_url) {
        profileImage.value = user.value.user.profile_pic_url;
      } else {
        profileImage.value = '../user-profile-icon.jpg'; // Standardbild
      }
    } catch (err) {
      console.error("Error fetching authenticated user:", err);
      error.value = err;
      user.value = null;
      profileImage.value = '../user-profile-icon.jpg'; // Standardbild bei Fehler
    } finally {
      loading.value = false;
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

  const deleteAccount = async () => {
    try {
      loading.value = true;
      const response = await AuthService.deleteAccount();
      user.value = null;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting account';
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

  const uploadProfilePicture = async (formData) => {
    try {
      const response = await AuthService.uploadProfilePicture(formData); // Aufruf des AuthService
      user.value = response.data; // Aktualisiere den Benutzerzustand mit den neuen Daten
    } catch (err) {
      error.value = err.response?.data?.message || 'Fehler beim Hochladen des Bildes';
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      loading.value = true;
      const response = await AuthService.registerUser(userData);
      user.value = response.data.user; // Setze den registrierten Benutzer
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Fehler bei der Registrierung';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  



  return {
    user,
    profileImage,
    loading,
    error,
    isAuthenticated,
    uploadProfilePicture,
    fetchUser,
    setUser,
    login,
    logout,
    updateUser,
    updatePassword,
    deleteAccount,
    register,
  };
});
