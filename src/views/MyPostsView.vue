<template>
  <HeaderMain />

  <Sidebar :collapsed="true" @toggle="handleToggle" />

  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <!-- Hauptinhalt -->
  <div class="main-content">
    <div class="post-container">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.id)"
      >
        <!-- Post Header -->
        <div class="post-header">
          <h2 class="post-title">{{ post.contentTitle }}</h2>
          <p class="post-date">{{ formatDate(post.created_at) }}</p>
        </div>

        <!-- Post Image -->
        <div v-if="post.contentImg" class="post-image">
          <img :src="post.contentImg" alt="Post image" />
        </div>

        <!-- Post Content Preview -->
        <div class="post-content-preview">
          {{ truncateContent(post.content, 6) }}
        </div>

        <!-- Post Actions -->
        <div class="post-actions">
          <div class="action-stats">
            <span
              ><i class="fas fa-heart"></i>
              {{ post.likes ? post.likes.length : 0 }}</span
            >
            <span
              ><i class="fas fa-comment"></i>
              {{ post.comments ? post.comments.length : 0 }}</span
            >
            <span
              ><i class="fas fa-bookmark"></i>
              {{ post.bookmarks ? post.bookmarks.length : 0 }}</span
            >
          </div>
        </div>

        <!-- Edit Buttons -->
        <div class="edit-buttons">
          <button @click.stop="editPost(post.id)">Edit</button>
          <button @click="deletePost(post.id)" class="delete-button">
            Delete Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "../services/AuthService";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";

const router = useRouter();
const posts = ref([]);
const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const navigateToPost = (postId) => {
  router.push({ name: "post", params: { id: postId } });
};

const fetchMyPosts = async () => {
  try {
    const res = await authClient.get("/api/myposts");
    posts.value = res.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    console.log("Fetched my posts:", res.data);
  } catch (error) {
    console.error("Error fetching my posts:", error.response || error);
    // Log more details about the error
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const truncateContent = (content, lines) => {
  const words = content.split(" ");
  const truncated = words.slice(0, lines * 10).join(" ");
  return truncated + (words.length > lines * 10 ? "..." : "");
};

const editPost = (postId) => {
  router.push(`/post/${postId}/edit`);
};

const deletePost = async (postId) => {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      await authClient.delete(`/api/posts/${postId}`);
      posts.value = posts.value.filter((post) => post.id !== postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
};

onMounted(fetchMyPosts);
</script>

<style scoped>
.main-content {
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  transition: all 0.3s ease;
  padding: 20px;
  background: radial-gradient(
    #813d9c 0%,
    #613583 43%,
    #3d3846 73%,
    #241f31 91%
  );
  color: white;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.post-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.post-card {
  background-color: #1c1f26;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 20px;
  width: calc(50% - 10px); /* 50% width minus half of the gap */
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.post-card:hover {
  border-color: rgba(206, 61, 243, 0.4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(206, 61, 243, 0.3);
}

.post-header {
  margin-bottom: 10px;
}

.post-title {
  font-size: 1.4em;
  margin: 0 0 5px 0;
  color: white;
}

.post-date {
  font-size: 0.9em;
  color: #aaa;
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-bottom: 10px;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content-preview {
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-stats {
  display: flex;
  gap: 15px;
}

.action-stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.edit-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #ce3df3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.edit-button:hover,
.delete-button:hover {
  opacity: 0.8;
}

@media screen and (max-width: 768px) {
  .post-card {
    width: 100%;
  }
}
</style>
