// services/PostService.js

import { authClient } from "./AuthService";



const PostLike_URL = "/api/posts";
const CommentLike_URL = "/api/comments";

export default {
  // Alle Posts abrufen
  async getAllPosts() {
    try {
      const response = await authClient.get('/api/index');
      return response.data.posts; // Direkt das Array zurückgeben
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
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

  /**
   * Ruft einen einzelnen Post anhand der ID ab.
   * @param {Number|String} postId - Die ID des Posts.
   * @returns {Promise<Object>} - Die Post-Daten.
   */
  async getSinglePost(postId) {
    try {
      const response = await authClient.get(`/api/posts/${postId}`);
      return response.data.post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  /**
   * Ruft die Anzahl der Likes für einen Post ab.
   * @param {Number|String} postId - Die ID des Posts.
   * @returns {Promise<Number>} - Die Anzahl der Likes.
   */
  async getLikeCount(postId) {
    try {
      const response = await authClient.get(`/api/posts/${postId}/likes`);
      return response.data.likes;
    } catch (error) {
      console.error("Error fetching like count:", error);
      throw error;
    }
  },



  async likePost(postId) {
    try {
      const response = await authClient.post(`/api/posts/${postId}/like`);
      return response.data; // { message, likes_count, is_liked }
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },
  
  async unlikePost(postId) {
    try {
      const response = await authClient.delete(`/api/posts/${postId}/unlike`);
      return response.data; // { message, likes_count, is_liked }
    } catch (error) {
      console.error("Error unliking post:", error);
      throw error;
    }
  },
  
  async likeComment(commentId) {
    try {
      const response = await authClient.post(`/api/comments/${commentId}/like`);
      return response.data; // { message, likes_count, is_liked }
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  },

  async unlikeComment(commentId) {
    try {
      const response = await authClient.delete(`/api/comments/${commentId}/unlike`);
      return response.data; // { message, likes_count, is_liked }
    } catch (error) {
      console.error("Error unliking comment:", error);
      throw error;
    }
  },

  async bookmarkPost(postId) {
    try {
      const response = await authClient.post(`/api/posts/${postId}/bookmark`);
      return response.data; // { message }
    } catch (error) {
      console.error("Error bookmarking post:", error);
      throw error;
    }
  },

  async unbookmarkPost(postId) {
    try {
      const response = await authClient.delete(`/api/posts/${postId}/unbookmark`);
      return response.data; // { message }
    } catch (error) {
      console.error("Error unbookmarking post:", error);
      throw error;
    }
  },

  async getBookmarkedPosts() {
    try {
      const response = await authClient.get(`/api/bookmarked-posts`);
      return response.data.bookmarked_posts; // Angenommen, die API gibt die Posts unter 'bookmarked_posts' zurück
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
      throw error;
    }
  },
  
};


