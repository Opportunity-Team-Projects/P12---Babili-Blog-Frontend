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
    <!-- Filter- und Einstellungen-Buttons -->
    <div class="top-buttons">
      <div class="filter-buttons">
        <button
          :class="{ active: sortOption === 'recent' }"
          @click="
            sortOption = 'recent';
            sortPosts();
          "
        >
          Most Recent
        </button>
        <button
          :class="{ active: sortOption === 'popular' }"
          @click="
            sortOption = 'popular';
            sortPosts();
          "
        >
          Most Popular
        </button>
      </div>
      <button
        v-if="$route.path === '/my-feed'"
        class="custom-feed-settings-button"
        @click="openCustomFeedSettings"
      >
        <i class="fas fa-cog"></i>&nbsp; Custom Feed Settings
      </button>
    </div>

    <!-- Post Container -->
    <div class="post-container">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.id)"
        tabindex="0"
        @keyup.enter="navigateToPost(post.id)"
        role="button"
        aria-label="View post details"
      >
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
          <h2 class="post-title">
            {{ post.contentTitle }}
          </h2>

          <!-- Post Image oder Content Preview -->
          <div
            v-if="post.contentImg && !imageError[post.id]"
            class="image-container"
          >
            <img
              :src="getImageUrl(post.contentImg)"
              alt="Post Image"
              class="post-image"
              @error="handleImageError(post.id)"
            />
          </div>
          <div v-else class="content-preview">
            {{ post.content }}
          </div>

          <p class="post-author">
            by {{ post.user ? post.user.name : "Unknown" }}
          </p>
          <p class="post-date">{{ formatDate(post.created_at) }}</p>
        </div>

        <!-- Post Actions -->
        <div class="post-actions" @click.stop>
          <div class="icon-left">
            <HeartIcon
              :type="'post'"
              :id="post.id"
              :initiallyLiked="post.is_liked"
              :isOwnItem="post.user.id === currentUserId"
              @update-like="
                (likes_count, is_liked) =>
                  updateLikeCount(post.id, likes_count, is_liked)
              "
            />
            <span>{{ post.likes_count }}</span>

            <!-- Comment Icon and Count -->
            <i class="fas fa-comment action-icon"></i>
            <span>{{ post.comments_count || 0 }} </span>
          </div>
          <BookmarkIcon
            :postId="post.id"
            :initiallyBookmarked="post.is_bookmarked"
            @update-bookmark="updateBookmarkStatus(post.id, $event)"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Custom Feed Component -->
  <CustomFeed
    v-if="showCustomFeed"
    @close="closeCustomFeedSettings"
    @save="saveCustomFeedSettings"
  />
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import PostService from "@/services/PostService";
import HeaderMain from "@/components/HeaderMain.vue";
import HeartIcon from "@/components/HeartIcon.vue";
import Sidebar from "@/components/Sidebar.vue";
import BookmarkIcon from "@/components/BookmarkIcon.vue";
import CustomFeed from "@/components/CustomFeed.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const posts = ref([]);
const isSidebarCollapsed = ref(true);
const showCustomFeed = ref(false);
const sortOption = ref("recent");

// Reaktive Referenz für Bildfehler
const imageError = ref({});

const getImageUrl = (imagePath) => {
  return `${import.meta.env.VITE_APP_BACKEND_URL}/storage/${imagePath}`;
};

// Fehlerbehandlungsfunktion, die das Bildfehler-Flag für den spezifischen Post setzt
const handleImageError = (postId) => {
  imageError.value = { ...imageError.value, [postId]: true };
};

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

const sortPosts = () => {
  if (sortOption.value === "recent") {
    posts.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption.value === "popular") {
    posts.value.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
  }
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
    } else if (route.path === "/bookmarks") {
      res = await PostService.searchBookmarkedPosts(query);
    } else {
      res = await PostService.searchPosts(query);
    }
    posts.value = res.data;
    sortPosts();
    console.log("Search results:", res.data);
  } catch (error) {
    console.error("Error searching posts:", error);
  }
};

const fetchUserCategoryPosts = async () => {
  try {
    const res = await PostService.getPostsByUserCategories();
    posts.value = res.data;
    sortPosts();
    console.log("Fetched user category posts:", res.data);
  } catch (error) {
    console.error("Error fetching user category posts:", error);
  }
};

const fetchBookmarkedPosts = async () => {
  try {
    const bookmarkedPosts = await PostService.getBookmarkedPosts();
    posts.value = bookmarkedPosts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    console.log("Fetched bookmarked posts:", bookmarkedPosts);
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
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

const updateBookmarkStatus = (postId, isBookmarked) => {
  const post = posts.value.find((p) => p.id === postId);
  if (post) {
    post.is_bookmarked = isBookmarked;
  }
};

// Watcher für Pfadänderungen und Suchanfragen
watch(
  [() => route.path, () => route.query.q],
  ([newPath, newQuery]) => {
    // Überprüfung der geschützten Pfade und des Benutzers
    const protectedPaths = ["/my-feed", "/bookmarks"];
    if (protectedPaths.includes(newPath) && !user.value) {
      router.push("/login");
      return; // Den Rest der Logik nicht ausführen, wenn umgeleitet wird
    }

    // Bestehende Logik bleibt unberührt
    if (newQuery) {
      searchPosts(newQuery);
    } else if (newPath === "/my-feed") {
      fetchUserCategoryPosts();
    } else if (newPath === "/bookmarks") {
      fetchBookmarkedPosts();
    } else if (newPath === "/") {
      fetchAllPosts();
    }
  },
  { immediate: true }
);

onMounted(() => {
  const protectedPaths = ["/my-feed", "/bookmarks"];
  if (protectedPaths.includes(route.path) && !user.value) {
    router.push("/login");
  }
});
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

/* Neue Styles für die obere Button-Leiste */
.top-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 180px;
  margin-right: 190px;
  margin-top: 20px;
}

.filter-buttons {
  display: flex;
}

.filter-buttons button {
  padding: 10px 15px;
  font-size: 1em;
  font-weight: 550;
  color: #cf3df3d2;
  background-color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.filter-buttons button.active {
  background-color: #ce3df3;
  color: white;
}

.filter-buttons button:hover {
  background-color: rgba(255, 255, 255, 0.836);
}

.custom-feed-settings-button {
  padding: 10px 15px;
  font-size: 1em;
  font-weight: 550;
  color: white;
  background-color: #cf3df3d2;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
}

.custom-feed-settings-button:hover {
  background-color: #cf3df3a2;
}

.post-container {
  margin-left: 170px;
  margin-right: 170px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: white;
}

.post-card {
  margin-top: 32px;
  background-color: #1c1f26;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 20px;
  width: 355px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden; /* Verhindert das Überlaufen von Inhalten */
  cursor: pointer; /* Ändert den Mauszeiger, um Klickbarkeit anzuzeigen */
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

  border: 1px solid violet;
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

.content-preview {
  width: 100%;
  height: 150px; /* Gleiche Höhe wie das Bild */
  font-weight: 300;
  border-radius: 8px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Begrenzung auf 3 Zeilen */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: white;
  font-size: 1em;
}

.post-image {
  width: 100%;
  height: 150px;
  object-fit: cover; /* Verhindert das Verzerren der Bilder */
  border-radius: 8px; /* Gleiche Border-Radius wie die Karte */
  margin-bottom: 10px;
}

/* Neue Klasse für Content-Preview */
.content-preview {
  width: 100%;
  height: 150px; /* Gleiche Höhe wie das Bild */
  font-weight: 300;
  border-radius: 8px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Begrenzung auf 3 Zeilen */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: white;
  font-size: 1em;
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
  margin-left: 10px;
}

.action-icon:hover {
  color: rgba(255, 255, 255, 0.918);
  transform: scale(1.1);
  pointer-events: auto;
}

@media screen and (max-width: 768px) {
  .top-buttons {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 25px;
    margin-right: 25px;
  }

  .filter-buttons {
    margin-bottom: 10px;
  }

  .filter-buttons button {
    padding: 8px 12px;
    font-size: 0.8em;
  }

  .custom-feed-settings-button {
    padding: 8px 12px;
    font-size: 0.8em;
    margin-bottom: 20px;
  }

  .post-container {
    margin-left: 25px;
    margin-right: 25px;
    justify-content: center;
  }

  .post-card {
    width: 100%;
  }

  .post-image,
  .content-preview {
    height: 200px; /* Optional: Größere Höhe für kleinere Bildschirme */
  }
}
</style>
