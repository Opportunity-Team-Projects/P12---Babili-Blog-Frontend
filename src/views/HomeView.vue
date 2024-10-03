<template>
  <div>
    <div v-for="post in posts" :key="post.id">
      <h2>{{ post.contentTitle }}</h2>
      <p>{{ post.contentPreview }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authClient } from '../services/AuthService';

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

onMounted(fetchAllPosts);
</script>