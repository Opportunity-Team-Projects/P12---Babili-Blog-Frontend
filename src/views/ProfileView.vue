<template>
    <HeaderMain />
  
    <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />
  
    <div v-if="!isSidebarCollapsed" class="overlay" @click="handleToggle(true)"></div>
  
    <div class="main-content">



    </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '@/services/AuthService';
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();

const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};


</script>

<style scoped>

  .main-content {
    z-index: 1; 
    width: 100%;
    transition: all 0.3s ease;
    padding: 20px; 
    background-color: 0E1217;
    /* background: radial-gradient(#3584e4 0%, #1a5fb4 15%, #1c71d8 34%, #241f31 62%, #000000 92%); */
    /* background: radial-gradient(#62a0ea 0%, #1c71d8 28%, #1a5fb4 46%, #241f31 75%);*/    
    color: white;
    display: flex;
    justify-content: center;
    padding-top: 43px;
    min-height: 100vh;
}

.profile-container {
    max-width: 680px;
    height: min-content;
    background-color: #1C1F26;
    border-radius: 8px;
    border: 1px solid #909090;
    display: flex;
    flex-direction: column;
}


</style>