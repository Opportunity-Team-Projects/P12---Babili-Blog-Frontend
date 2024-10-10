<template>
  <HeaderMain />

  <!-- Sidebar-Komponente mit Event-Listener für das Toggle-Event -->
  <Sidebar :collapsed="true" @toggle="handleToggle" />

  <!-- Überlagerung, die erscheint, wenn die Sidebar geöffnet ist -->
  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <!-- Hauptinhalt -->
  <div class="main-content">
    <div class="post-container">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="profile-placeholder">
            <i class="fas fa-user"></i>
          </div>
          <h2 class="post-title">{{ post.contentTitle }}</h2>
        </div>
        <div class="post-image-placeholder">
          <i class="fas fa-image"></i>
        </div>
        <p class="post-author">
          by {{ post.user ? post.user.name : "Unknown" }}
        </p>
        <p class="post-date">{{ formatDate(post.created_at) }}</p>
        <div class="post-actions">
          <div class="icon-left">
            <i class="fas fa-heart action-icon"></i>
            <i class="fas fa-comment action-icon"></i>
          </div>
          <i class="fas fa-bookmark action-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { authClient } from "../services/AuthService";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useRoute } from "vue-router";

// Reaktive Variable für die Beiträge
const posts = ref([]);
const route = useRoute();

const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

// Funktion zum Abrufen aller Beiträge
const fetchAllPosts = async () => {
  try {
    const res = await authClient.get("/api/index");
    posts.value = res.data;
    console.log("Fetched all posts:", res.data);
  } catch (error) {
    console.error("Error fetching all posts:", error);
  }
};

// Funktion zur Suche von Beiträgen
const searchPosts = async (query) => {
  try {
    const res = await authClient.get("/api/search", { params: { query } });
    posts.value = res.data;
    console.log("Search results:", res.data);
  } catch (error) {
    console.error("Error searching posts:", error);
  }
};

// Funktion zur Formatierung des Datums
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

//TODO Prüfe ob nichtmehr benötigt
/* onMounted(() => {
  if (route.query.q) {
    searchPosts(route.query.q);
  } else {
    fetchAllPosts();
  }
}); */

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchPosts(newQuery);
    } else {
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
  min-height: 100vw;
  transition: all 0.3s ease;
  padding: 20px;
  background-color: #0e1217;
  color: white;
}

.overlay {
  position: fixed;

  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000; /* Unterhalb der Sidebar */
  transition: opacity 0.3s ease;
}

.post-container {
  margin-left: 101px;
  margin-right: 101px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  color: white;
}

.post-card {
  margin-top: 32px;
  background-color: #1c1f26;
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  display: flex;
  flex-direction: column;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border-color: black;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  margin-bottom: 12px;
}

.post-title {
  font-size: 1.2em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.3em;
  height: 3.9em;
  margin-bottom: 8px;
  color: white;
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
}

.post-author {
  margin-top: 5px;
  font-size: 0.9em;
  color: white;
}
.post-date {
  font-size: 0.9em;
  color: white;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: white;
}
.post-actions .action-icon:not(:last-child) {
  margin-right: 10px; /* Abstand nach rechts, außer beim letzten Icon */
}

.action-icon {
  font-size: 1.2em;
  cursor: pointer;
  color: white;
  transition: color 0.3s ease;
  padding-right: 2px;
  padding-left: 2px;
  transition: transform 0.3s ease;
}

.action-icon:hover {
  color: rgba(255, 255, 255, 0.918);
  transform: scale(1.1);
}

@media screen and (max-width: 768px) {
  .post-container {
    margin-top: 25px;
    margin-left: 25px;
    margin-right: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
  }
}
</style>
