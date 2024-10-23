<template>
  <HeaderMain />

  <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />

  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <!-- Hauptinhalt -->
  <div class="main-content">
    <div class="post-container">
      <div
        v-for="post in sanitizedPosts"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.id)"
      >
        <!-- Post Header mit Edit-Button -->
        <div class="post-header">
          <h2 class="post-title">{{ post.contentTitle }}</h2>
          <button
            @click.stop="editPost(post.id)"
            class="edit-button"
            aria-label="Edit Post"
          >
            <i class="fas fa-edit"></i>
          </button>
        </div>

        <!-- Post Datum -->
        <p class="post-date">{{ formatDate(post.created_at) }}</p>

        <!-- Post Bild -->
        <div
          v-if="post.contentImg && post.contentImg.trim() !== ''"
          class="post-image"
        >
          <img
            :src="getImageUrl(post.contentImg)"
            alt="Post image"
            @error="handleImageError"
          />
        </div>

        <!-- Post Inhalt Vorschau mit Markdown -->
        <div
          class="post-content-preview markdown-body"
          v-html="post.sanitizedContent"
        ></div>

        <!-- Post Aktionen und Delete-Button -->
        <div class="post-actions">
          <div class="action-stats">
            <span>
              <i class="fas fa-heart"></i>
              {{ post.likes ? post.likes.length : 0 }}
            </span>
            <span>
              <i class="fas fa-comment"></i>
              {{ post.comments ? post.comments.length : 0 }}
            </span>
            <span>
              <i class="fas fa-bookmark"></i>
              {{ post.bookmarks ? post.bookmarks.length : 0 }}
            </span>
          </div>
          <button
            @click.stop="deletePost(post.id)"
            class="delete-button"
            aria-label="Delete Post"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "../services/AuthService";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";
import { marked } from "marked";
import DOMPurify from "dompurify"; // Importiere DOMPurify

const router = useRouter();
const posts = ref([]);
const isSidebarCollapsed = ref(true);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Funktion zum Abrufen des Bild-URLs
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === "") return "";
  return `${import.meta.env.VITE_APP_BACKEND_URL}/storage/${imagePath}`;
};

// Fehlerbehandlungsfunktion für Bilder
const handleImageError = (event) => {
  event.target.style.display = "none";
  // Optional: event.target.src = '/path/to/placeholder-image.jpg';
};

// Funktion zum Umschalten der Sidebar
const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

// Navigation zur einzelnen Post-Ansicht
const navigateToPost = (postId) => {
  router.push({ name: "post", params: { id: postId } });
};

// Funktion zum Abrufen der eigenen Posts
const fetchMyPosts = async () => {
  try {
    const res = await authClient.get("/api/my-posts");
    posts.value = res.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    console.log("Fetched my posts:", res.data);
  } catch (error) {
    console.error("Error fetching my posts:", error.response || error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
};

// Funktion zur Formatierung des Datums
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Funktion zum Kürzen des Inhalts
const truncateContent = (content, maxCharacters) => {
  if (content.length <= maxCharacters) {
    return content;
  }
  return content.substring(0, maxCharacters) + "...";
};

// Funktion zum Bearbeiten eines Posts
const editPost = (postId) => {
  router.push(`/post/${postId}/edit`);
};

// Funktion zum Löschen eines Posts
const deletePost = async (postId) => {
  if (confirm("Bist du sicher, dass du diesen Post löschen möchtest?")) {
    try {
      await authClient.delete(`/api/posts/${postId}`);
      posts.value = posts.value.filter((post) => post.id !== postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
};

// Funktion zum Parsen und Bereinigen von Markdown
const parseAndSanitizeMarkdown = (content) => {
  const rawHtml = marked.parse(content);
  return DOMPurify.sanitize(rawHtml);
};

// Berechnete Eigenschaft, die eine neue Liste von Posts mit bereinigtem HTML-Inhalt erstellt
const sanitizedPosts = computed(() => {
  return posts.value.map((post) => ({
    ...post,
    sanitizedContent: parseAndSanitizeMarkdown(post.content),
  }));
});

onMounted(() => {
  if (!user.value) {
    router.push("/login");
  } else {
    fetchMyPosts();
  }
});
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

/* Verwende CSS Grid für gleich große Post-Karten */
.post-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.post-card {
  background-color: #1c1f26;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  /* Feste Höhe für alle Karten */
  height: 450px;
  overflow: hidden; /* Verhindert Überlauf */
}

.post-card:hover {
  border-color: rgba(206, 61, 243, 0.4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(206, 61, 243, 0.3);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-title {
  font-size: 1.4em;
  margin: 0;
  color: white;
  flex: 1; /* Nimmt den verfügbaren Platz ein */
}

.edit-button {
  background: transparent;
  border: none;
  color: #cf3df3;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
}

.edit-button:hover {
  color: #b73adb;
}

.edit-button i {
  /* Keine zusätzliche Margin, da nur das Icon angezeigt wird */
}

.post-date {
  font-size: 0.9em;
  color: #aaa;
  margin-bottom: 10px;
}

.post-image {
  width: 100%;
  max-height: 150px; /* Maximale Höhe für das Bild */
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
  flex-grow: 1; /* Nimmt den verfügbaren Platz ein */
  overflow: hidden;
  position: relative;
}

.post-content-preview::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to top, #1c1f26, transparent);
}

/* Styling für Markdown-Inhalte */
.markdown-body {
  color: white;
  font-size: 1em;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: #cf3df3;
}

.markdown-body a {
  color: #cf3df3;
  text-decoration: underline;
}

.markdown-body code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

.markdown-body pre {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
}

/* Post Aktionen */
.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.delete-button {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: transparent;
  color: #f44336;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 1.1em;
}

.delete-button i {
  margin-right: 5px;
}

.delete-button:hover {
  background-color: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
  transform: scale(1.05);
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .post-container {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }

  .post-card {
    height: auto; /* Höhe passt sich an den Inhalt an */
  }

  .post-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .delete-button {
    align-self: flex-end;
  }

  .edit-button {
    margin-left: auto;
  }
}
</style>
