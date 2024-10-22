import axios from "axios";


export const authClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // required to handle the CSRF token
  withXSRFToken:true,
});

export default {
    async login(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("api/login", payload);
    },
  
    logout() {
      return authClient.post("api/logout");
    },
  
    async forgotPassword(payload) {
      await authClient.get("/sanctum/csrf-cookie");
      return authClient.post("api/forgot-password", payload);
    },
  
    getAuthUser() {
      return authClient.get("api/user");
    },
  
    async resetPassword(payload) {
      await authClient.get("/sanctum/csrf-cookie");
      return authClient.post("api/reset-password", payload);
    },
  
    updatePassword(payload) {
      return authClient.put("api/user/password", payload);
    },
  
    async registerUser(payload) {
      await authClient.get("/sanctum/csrf-cookie");
      return authClient.post("api/register", payload);
    },
  
    sendVerification(payload) {
      return authClient.post("api/email/verification-notification", payload);
    },
  
    updateUser(payload) {
      return authClient.put("api/user/profile-information", payload);
    },

    deleteAccount() {
      return authClient.delete("api/user/delete");
    },
  };