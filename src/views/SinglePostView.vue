<template>
  <HeaderMain />
  <Sidebar />
  <div class="post-container">
    <div class="post-view" v-if="post">
      <div class="post-header" :style="{ backgroundColor: '#9E15D9' }">
        <div class="header-top">
          <div class="post-date">{{ formatDate(post.created_at) }}</div>
          <button class="close-button" @click="goBack">
            <i class="fas fa-times"></i>
          </button>
        </div>
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
          <HeartIcon
            :postId="post.id"
            :initiallyLiked="post.is_liked"
            :isOwnPost="post.user.id === currentUserId"
            @update-like="handleLikeUpdate"
          />
          <span>{{ likeCount }} likes</span>
          <i @click="scrollToComments" class="fas fa-comment action-icon"></i>
          <span>{{ post.comments.length }} comments</span>
          <i class="fas fa-bookmark action-icon"></i>
        </div>
      </div>
    </div>
    <div class="comment-container" v-if="post" ref="commentSection">
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
            <HeartIcon
              :type="'comment'"
              :id="comment.id"
              :initiallyLiked="comment.is_liked"
              :isOwnItem="currentUserId === comment.user.id"
              @update-like="
                (likes_count, is_liked) =>
                  updateCommentLike(comment.id, likes_count, is_liked)
              "
            />
            <span>{{ comment.likes_count }} likes</span>
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
import { useRoute, useRouter } from "vue-router";
import { authClient } from "@/services/AuthService";
import HeaderMain from "@/components/HeaderMain.vue";
import HeartIcon from "@/components/HeartIcon.vue";
import Sidebar from "@/components/Sidebar.vue";
import PostService from "@/services/PostService";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const post = ref(null);
const newCommentContent = ref("");
const isFollowing = ref(false);
const likeCount = ref(0);
const isLiked = ref(false);
const currentUserId = computed(() => user.value?.user?.id);
const commentSection = ref(null);

const updateCommentLike = (commentId, likes_count, is_liked) => {
  const comment = post.value.comments.find((c) => c.id === commentId);
  if (comment) {
    comment.likes_count = likes_count;
    comment.is_liked = is_liked;
  }
};

const scrollToComments = () => {
  console.log("scrollToComments function called");
  if (commentSection.value) {
    commentSection.value.scrollIntoView({ behavior: "smooth" });
  } else {
    console.log("commentSection ref is null");
  }
};

const postId = computed(() => route.params.id);

const goBack = () => {
  router.go(-1);
};

const fetchPost = async () => {
  try {
    post.value = await PostService.getSinglePost(postId.value);
    console.log("Fetched post:", post.value); // Debugging
    likeCount.value = Number(post.value.likes_count) || 0; // Sicherstellen, dass es eine Zahl ist
    console.log("Like count:", likeCount.value); // Debugging
    isLiked.value = post.value.is_liked;
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

const handleLikeUpdate = (likes_count, liked) => {
  likeCount.value = likes_count;
  post.value.is_liked = liked;
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

onMounted(async () => {
  await fetchPost();
});
</script>

<style scoped>
.post-container {
  background: linear-gradient(135deg, #1c1f26 0%, #2c3e50 100%);
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.post-header {
  padding: 21px;
  color: white;
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-view {
  max-width: 850px;
  margin: 0 auto;
  background-color: #1c1f26;
  padding-bottom: 20px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 56px;
  position: relative;
}

.close-button {
  background-color: rgba(
    255,
    255,
    255,
    0.2
  ); /* Leicht transparenter weißer Hintergrund */
  color: white;
  border: 2px solid white; /* Weißer Rand */
  cursor: pointer;
  font-size: 1em;
  width: 30px; /* Feste Breite */
  height: 30px; /* Feste Höhe */
  border-radius: 50%; /* Macht den Button kreisförmig */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0; /* Entfernt das Padding */
}

.close-button i {
  font-size: 16px;
}
.close-button:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.3
  ); /* Etwas weniger transparent beim Hover */
  transform: scale(1.05); /* Leichte Vergrößerung beim Hover */
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
  margin-right: 5px;
}

.action-icon:hover {
  color: #ddd;
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
