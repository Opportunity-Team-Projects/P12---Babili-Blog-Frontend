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

      <div class="comment-container">
        <h2>Discussions about this post</h2>
        <div class="comment-input">
          <textarea
            v-model="newCommentContent"
            placeholder="Write a comment..."
          ></textarea>
          <button @click="submitComment" class="comment-button">Comment</button>
        </div>
        <div class="comments-list">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="comment"
          >
            <img
              :src="comment.user.profile_photo_url"
              alt="Commenter profile"
              class="commenter-image"
            />
            <div class="comment-content">
              <span class="commenter-name">{{ comment.user.name }}</span>
              <p>{{ comment.commentContent }}</p>
            </div>
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
const newCommentTitle = ref("");
const newCommentContent = ref("");
const isFollowing = ref(false);
const likeCount = ref(0);
const isLiked = ref(false);

const postId = computed(() => route.params.id);

onMounted(async () => {
  await fetchPost();
  await fetchLikeCount();
});

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

const submitComment = async () => {
  try {
    const response = await authClient.post(
      `/api/posts/${postId.value}/comments`,
      {
        commentTitle: newCommentTitle.value,
        commentContent: newCommentContent.value,
      }
    );
    post.value.comments.push(response.data.comment);
    newCommentTitle.value = "";
    newCommentContent.value = "";
  } catch (error) {
    console.error("Error submitting comment:", error);
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
  height: 100vh;
}
.post-view {
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  padding: 20px;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.post-date {
  font-size: 0.9em;
  margin-bottom: 10px;
}

.post-title {
  font-size: 2em;
  margin-bottom: 15px;
}

.author-info {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.follow-button {
  background-color: white;
  color: #9e15d9;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.post-content {
  margin-bottom: 30px;
  color: white;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}

.post-text {
  line-height: 1.6;
  margin-bottom: 20px;
}

.post-actions {
  display: flex;
  gap: 15px;
}

.action-icon {
  font-size: 1.5em;
  cursor: pointer;
}

.comment-container {
  border-radius: 8px;
  color: white;
}

.comment-input {
  margin-bottom: 20px;
  color: white;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #20252d;
  color: white;
}

.comment-button {
  background-color: #9e15d9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}

.comments-list {
  margin-top: 30px;
}

.comment {
  display: flex;
  margin-bottom: 20px;
}

.commenter-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.commenter-name {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}
</style>
