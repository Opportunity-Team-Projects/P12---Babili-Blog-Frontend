<template>
  <div class="app-container">
    <!-- Sidebar-Komponente mit Event-Listener für das Toggle-Event -->
    <Sidebar @toggle="handleToggle" />
    
    <!-- Hauptinhalt, der sich basierend auf dem Sidebar-Zustand anpasst -->
    <div :class="['main-content', { 'collapsed': isSidebarCollapsed }]">
      <HeaderMain />
      
      <div class="post-container">
        <!-- Korrekt verschachtelter v-for-Loop -->
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
          <p class="post-author">by {{ post.user ? post.user.name : 'Unknown' }}</p>
          <p class="post-date">{{ formatDate(post.created_at) }}</p>
          <div class="post-actions">
            <i class="fas fa-heart action-icon"></i>
            <i class="fas fa-comment action-icon"></i>
            <i class="fas fa-bookmark action-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authClient } from '../services/AuthService';
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';

// Reaktive Variable für die Beiträge
const posts = ref([]);

// Funktion zum Abrufen aller Beiträge
const fetchAllPosts = async () => {
  try {
    const res = await authClient.get('/api/index');
    posts.value = res.data;
    console.log('Fetched all posts:', res.data);
  } catch (error) {
    console.error('Error fetching all posts:', error);
  }
};

// Funktion zur Formatierung des Datums
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Beim Mounten der Komponente Beiträge abrufen
onMounted(fetchAllPosts);

// Reaktive Variable für den Sidebar-Zustand
const isSidebarCollapsed = ref(false);

// Funktion zum Handhaben des Toggle-Events von der Sidebar
const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};
</script>

<style scoped>
.app-container {
  display: flex;
}

/* Hauptinhalt mit dynamischer Anpassung basierend auf dem Sidebar-Zustand */
.main-content {
  margin-left: 250px; /* Breite der Sidebar */
  width: 100%;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 80px; /* Breite der eingeklappten Sidebar */
}

@media screen and (max-width: 768px) {
  .main-content {
    margin-left: 80px;
  }

  .main-content.collapsed {
    margin-left: 0;
  }
}

/* Zusätzliche Styles für das Layout */
.post-container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.post-card {
  margin-top: 32px;
  background-color: #F9F9F9; /* Entfernt die doppelte Definition */
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
  background-color: #ddd;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
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
}

.post-image-placeholder {
  width: 100%;
  height: 150px;
  background-color: #eee;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  color: #888;
}

.post-author{ 
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}
.post-date {
  font-size: 0.9em;
  color: #666;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.action-icon {
  font-size: 1.2em;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;
}

.action-icon:hover {
  color: #555;
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
