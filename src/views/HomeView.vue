<template>
  <HeaderMain />

  <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />

  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <!-- Hauptinhalt -->
  <div class="main-content" :class="{ blurred: showCustomFeed }">
    <button
      v-if="$route.path === '/my-feed'"
      class="custom-feed-settings-button"
      @click="openCustomFeedSettings"
    >
      <i class="fas fa-cog"></i> Custom Feed Settings
    </button>
    <div class="post-container">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <!-- Post Header -->
        <div class="post-header">
          <div class="profile-placeholder">
            <img
              v-if="post.user && post.user.avatarUrl"
              :src="post.user.avatarUrl"
              alt="Profilbild"
              class="profile-image"
            />
            <i v-else class="fas fa-user"></i>
          </div>
          <i class="fas fa-ellipsis-h more-options-icon"></i>
        </div>

        <!-- Post Details -->
        <div class="post-details">
          <h2 class="post-title" @click="navigateToPost(post.id)">
            {{ post.contentTitle }}
          </h2>

          <!-- Post Image -->
          <div class="post-image-placeholder" @click="navigateToPost(post.id)">
            <i class="fas fa-image"></i>
          </div>
          <p class="post-author">
            by {{ post.user ? post.user.name : "Unknown" }}
          </p>
          <p class="post-date">{{ formatDate(post.created_at) }}</p>
        </div>

        <!-- Post Actions -->
        <div class="post-actions">
          <div class="icon-left">
            <HeartIcon
              :postId="post.id"
              :initiallyLiked="post.is_liked"
              :isOwnPost="post.user.id === currentUserId"
              @update-like="
                (likes_count, is_liked) =>
                  updateLikeCount(post.id, likes_count, is_liked)
              "
            />
            <span>{{ post.likes_count }}</span>
            <i class="fas fa-comment action-icon"></i>
          </div>
          <i class="fas fa-bookmark action-icon"></i>
        </div>
      </div>
    </div>
  </div>

  <CustomFeed
    v-if="showCustomFeed"
    @close="closeCustomFeedSettings"
    @save="saveCustomFeedSettings"
  />
</template>

<script setup>
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import PostService from "@/services/PostService";
import HeaderMain from "@/components/HeaderMain.vue";
import HeartIcon from "@/components/HeartIcon.vue";
import Sidebar from "@/components/Sidebar.vue";
import CustomFeed from "@/components/CustomFeed.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const posts = ref([]);
const isSidebarCollapsed = ref(true);
const showCustomFeed = ref(false);

const { user } = storeToRefs(authStore);

const currentUserId = computed(() => user.value?.user?.id);
const props = defineProps({
  query: {
    type: String, // Passe den Typ entsprechend an
    required: false,
    default: "",
  },
});

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const fetchAllPosts = async () => {
  try {
    const postsArray = await PostService.getAllPosts();
    posts.value = postsArray.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    console.log("Fetched all posts:", postsArray);
  } catch (error) {
    console.error("Error fetching all posts:", error);
  }
};

const searchPosts = async (query) => {
  try {
    let res;
    if (route.path === "/my-feed") {
      res = await PostService.searchPostsInUserCategories(query);
    } else {
      res = await PostService.searchPosts(query);
    }
    posts.value = res.data;
    console.log("Search results:", res.data);
  } catch (error) {
    console.error("Error searching posts:", error);
  }
};

const fetchUserCategoryPosts = async () => {
  try {
    const res = await PostService.getPostsByUserCategories();
    posts.value = res.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    console.log("Fetched user category posts:", res.data);
  } catch (error) {
    console.error("Error fetching user category posts:", error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const navigateToPost = (postId) => {
  router.push(`/posts/${postId}`);
};

const openCustomFeedSettings = () => {
  showCustomFeed.value = true;
};

const closeCustomFeedSettings = () => {
  showCustomFeed.value = false;
};

const saveCustomFeedSettings = async (selectedCategories) => {
  showCustomFeed.value = false;
  if (route.path === "/my-feed") {
    await fetchUserCategoryPosts();
  }
};

const updateLikeCount = (postId, likes_count, is_liked) => {
  const post = posts.value.find((p) => p.id === postId);
  if (post) {
    post.likes_count = likes_count;
    post.is_liked = is_liked;
  }
};

// Watcher für Pfadänderungen und Suchanfragen
watch(
  [() => route.path, () => route.query.q],
  ([newPath, newQuery]) => {
    if (newQuery) {
      searchPosts(newQuery);
    } else if (newPath === "/my-feed") {
      fetchUserCategoryPosts();
    } else if (newPath === "/") {
      fetchAllPosts();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.app-container {
  position: relative;
}

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

.main-content.blurred {
  filter: blur(5px);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.custom-feed-settings-button {
  margin-left: 190px;
  padding: 10px 15px;
  font-size: 0.9em;
  color: white;
  background-color: #cf3df3d2;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.post-container {
  margin-left: 170px;
  margin-right: 170px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0);
}

.post-card {
  margin-top: 32px;
  background-color: #1c1f26;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 20px;
  width: 340px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.post-card:hover {
  border-color: rgba(207, 61, 243, 0.644);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(206, 61, 243, 0.3);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.profile-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-options-icon {
  font-size: 1.2em;
  cursor: pointer;
  color: white;
  transition: color 0.3s ease;
}

.more-options-icon:hover {
  color: #9747ff;
}

.post-details {
  margin-bottom: 10px;
}

.post-title {
  font-size: 1.2em;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.3em;
  height: 3.9em;
  color: white;
  cursor: pointer;
}

.post-author,
.post-date {
  margin: 0;
  font-size: 0.9em;
  color: white;
}

.post-author {
  margin-top: 5px;
}

.post-date {
  margin-top: 2px;
}

.post-image-placeholder {
  width: 100%;
  height: 150px;
  background-color: white;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  color: rgba(0, 0, 0, 0.699);
  cursor: pointer;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid;
  border-image: linear-gradient(to left, rgba(206, 61, 243, 1), #ce3df3) 1;
}

.post-actions .action-icon:not(:last-child) {
  margin-right: 10px;
}

.action-icon {
  font-size: 1.6em;
  cursor: pointer;
  color: white;
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 2px;
}

.action-icon:hover {
  color: rgba(255, 255, 255, 0.918);
  transform: scale(1.1);
  pointer-events: auto;
}

@media screen and (max-width: 768px) {
  .custom-feed-settings-button {
    top: 70px;
    left: 10px;
    font-size: 0.8em;
    padding: 8px 12px;
  }

  .post-container {
    margin-top: 25px;
    margin-left: 25px;
    margin-right: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
  }

  .post-card {
    width: 100%;
  }
}
</style>
