<template>
  <HeaderMain />
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
      <p class="post-author">by {{ post.user ? post.user.name : 'Unknown' }}</p>
      <p class="post-date">{{ formatDate(post.created_at) }}</p>
      <div class="post-actions">
        <i class="fas fa-heart action-icon"></i>
        <i class="fas fa-comment action-icon"></i>
        <i class="fas fa-bookmark action-icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authClient } from '../services/AuthService';
import HeaderMain from '@/components/HeaderMain.vue';

const posts = ref([]);

const fetchAllPosts = async () => {
  try {
    const res = await authClient.get('/api/index');
    posts.value = res.data;
    console.log('Fetched all posts:', res.data);
  } catch (error) {
    console.error('Error fetching all posts:', error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(fetchAllPosts);
</script>

<style scoped>
.post-container {
  margin-top: 156px;
  margin-left: 101px;
  margin-right: 101px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
 
  padding: 20px;
}

.post-card {
  margin-top: 32px;
  background-color: #ffffff;
  border-radius: 8px;
  background-color: #F9F9F9;
  padding: 15px;
  width: 300px;
  display: flex;
  flex-direction: column;
}

.post-header {
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