<template>
  <HeaderMain />
  <Sidebar />
  <div class="post-container">
    <div class="post-view" v-if="post">
      <div class="post-header" :style="{ backgroundColor: '#9E15D9' }">
        <div class="post-date">{{ formatDate(post.created_at) }}</div>
        <h1 class="post-title">{{ post.contentTitle }}</h1>
        <div class="author-info">
          <img
            :src="post.user.profile_photo_url"
            alt="Author profile"
            class="profile-image"
          />
          <div class="author-details">
            <span class="author-name">{{ post.user.name }}</span>
            <button @click="toggleFollow" class="follow-button">
              {{ isFollowing ? "Unfollow" : "Follow" }}
            </button>
          </div>
        </div>
      </div>

      <div class="post-content">
        <img
          v-if="post.contentImg"
          :src="post.contentImg"
          alt="Post image"
          class="post-image"
        />
        <p class="post-text">{{ post.content }}</p>
        <div class="post-actions">
          <i
            @click="toggleLike"
            :class="['fas', 'fa-heart', 'action-icon', { liked: isLiked }]"
          ></i>
          <span>{{ likeCount }} likes</span>
          <i class="fas fa-bookmark action-icon"></i>
        </div>
      </div>
    </div>
    <div class="comment-container" v-if="post">
      <h2>Discussions about this post</h2>
      <div class="comment-input">
        <textarea
          v-model="newCommentContent"
          placeholder="Write a comment..."
        ></textarea>
        <button @click="submitComment" class="comment-button">Comment</button>
      </div>
      <div class="comments-list">
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <div class="author-info" v-if="post.user">
              <img
                :src="post.user.profile_photo_url"
                alt="Author profile"
                class="profile-image"
              />
              <!-- Rest of the template -->
            </div>

            <div class="comment-info">
              <span class="commenter-name">{{
                comment.user?.name || "Anonymous"
              }}</span>
              <span class="comment-date">{{
                formatCommentDate(comment.created_at)
              }}</span>
            </div>
          </div>
          <p class="comment-content">
            {{ comment.commentContent || comment.content }}
          </p>
          <div class="comment-footer">
            <div class="comment-likes">
              <i class="fas fa-heart"></i>
              <span>{{ comment.likes || 0 }}</span>
            </div>
            <button
              v-if="
                currentUserId &&
                comment.user &&
                currentUserId === comment.user.id
              "
              @click="deleteComment(comment.id)"
              class="delete-comment-button"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { authClient } from "@/services/AuthService";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";

const route = useRoute();
const post = ref(null);
const newCommentContent = ref("");
const isFollowing = ref(false);
const likeCount = ref(0);
const isLiked = ref(false);
const currentUserId = ref(null);

const postId = computed(() => route.params.id);

onMounted(async () => {
  await fetchPost();
  await fetchLikeCount();
  await fetchCurrentUser();
});

const fetchCurrentUser = async () => {
  try {
    const response = await authClient.get("/api/user");
    console.log("User response:", response.data);
    if (response.data && response.data.user && response.data.user.id) {
      currentUserId.value = response.data.user.id;
    } else {
      console.error("User ID not found in response");
    }
    console.log("Current user ID:", currentUserId.value);
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

const fetchPost = async () => {
  try {
    const response = await authClient.get(`/api/posts/${postId.value}`);
    post.value = response.data.post;
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

const fetchLikeCount = async () => {
  try {
    const response = await authClient.get(`/api/posts/${postId.value}/likes`);
    likeCount.value = response.data.likes;
  } catch (error) {
    console.error("Error fetching like count:", error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatCommentDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const submitComment = async () => {
  if (!newCommentContent.value.trim()) {
    console.error("Comment content cannot be empty");
    return;
  }

  try {
    await authClient.post(`/api/posts/${postId.value}/comments`, {
      commentContent: newCommentContent.value,
    });

    // Kommentar wurde erfolgreich gepostet, Seite neu laden
    window.location.reload();
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};

const deleteComment = async (commentId) => {
  try {
    await authClient.delete(`/api/comments/${commentId}`);
    // Nach erfolgreichem Löschen die Seite neu laden
    window.location.reload();
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

const toggleFollow = async () => {
  try {
    if (isFollowing.value) {
      await authClient.post(`/api/unfollow/${post.value.user.id}`);
    } else {
      await authClient.post(`/api/follow/${post.value.user.id}`);
    }
    isFollowing.value = !isFollowing.value;
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};

const toggleLike = async () => {
  try {
    if (isLiked.value) {
      await authClient.delete(`/api/posts/${postId.value}/unlike`);
      likeCount.value--;
    } else {
      await authClient.post(`/api/posts/${postId.value}/like`);
      likeCount.value++;
    }
    isLiked.value = !isLiked.value;
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
</script>

<style scoped>
.post-container {
  background: linear-gradient(135deg, #1c1f26 0%, #2c3e50 100%);
  min-height: 100vh;
  padding: 20px;
}

.post-view {
  max-width: 850px;
  margin: 0 auto;
  background-color: #1c1f26;
  padding-bottom: 20px;

  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 56px;
}

.post-header {
  padding: 21px;
  color: white;
}

.post-date {
  font-size: 0.94em;
  margin-bottom: 10px;
}

.post-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 17px;
}

.author-info {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 53px;
  height: 53px;
  border-radius: 50%;
  margin-right: 17px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1.02em;
}

.follow-button {
  background-color: white;
  color: #9e15d9;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85em;
}

.post-content {
  padding: 20px;

  color: white;
  font-size: 22px;
}

.post-image {
  width: 100%;
  max-height: 425px;
  object-fit: cover;
  margin-bottom: 20px;
}

.post-text {
  padding-top: 10px;
  line-height: 1.45;
  margin-bottom: 21px;
  font-size: 22px;
  font-weight: 350;
}

.post-actions {
  display: flex;
  gap: 17px;
}

.action-icon {
  font-size: 1.53em;
  cursor: pointer;
}

.comment-container {
  color: white;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-size: 20px;
  padding-bottom: 8px;
}

.comment-input {
  margin-bottom: 21px;
}

textarea {
  margin-top: 8px;
  width: 100%;
  height: 106px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #20252d;
  color: white;
  font-size: 0.94em;
}

.comment-button {
  background-color: #9e15d9;
  color: white;
  border: none;
  padding: 10px 21px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  font-size: 0.94em;
}

.comments-list {
  margin-top: 10px;
}

.comment {
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 17px;
  margin-bottom: 21px;
  font-size: 22px;
}

.comment-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.commenter-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 17px;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.commenter-name {
  font-weight: bold;
  margin-bottom: 2.5px;
  font-size: 0.94em;
}

.comment-date {
  font-size: 0.76em;
  color: #bbb;
}

.comment-content {
  margin-bottom: 10px;
  line-height: 1.28;
  font-size: 0.94em;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-likes {
  display: flex;
  align-items: center;
  font-size: 0.94em; /* Reduced from 1.1em */
}

.comment-likes i {
  color: #ff4136;
  margin-right: 6px; /* Reduced from 7px */
}

.delete-comment-button {
  background-color: #ff4136;
  color: white;
  border: none;
  padding: 6px 12px; /* Reduced from 7px 14px */
  border-radius: 5px; /* Reduced from 6px */
  cursor: pointer;
  font-size: 0.76em; /* Reduced from 0.9em */
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-comment-button:hover {
  background-color: #d63a2f;
}
</style>
