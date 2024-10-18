// services/PostService.js

import { authClient } from "./AuthService";

const PostLike_URL = "/api/posts";
const CommentLike_URL = "/api/comments";

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

  async likePost(postId) {
    return authClient.post(`${PostLike_URL}/${postId}/like`);
  },

  async unlikePost(postId) {
    return authClient.delete(`${PostLike_URL}/${postId}/unlike`);
  },
  
  async likeComment(commentId) {
    return authClient.post(`${CommentLike_URL}/${commentId}/like`);
  },

  async unlikeComment(commentId) {
    return authClient.delete(`${CommentLike_URL}/${commentId}/unlike`);
  },
};
