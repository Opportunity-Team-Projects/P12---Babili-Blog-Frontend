// services/PostService.js

import { authClient } from "./AuthService";

export default {
  // Alle Posts abrufen
  getAllPosts() {
    return authClient.get("/api/index");
  },

  // Posts basierend auf Suchanfrage abrufen
  searchPosts(query) {
    return authClient.get("/api/search", { params: { query } });
  },

  // Posts für Customfeed
  getPostsByUserCategories() {
    return authClient.get("/api/customfeed");
  },

  searchPostsInUserCategories(query) {
    return authClient.get("/api/search/user-categories", { params: { query } });
  },


};
