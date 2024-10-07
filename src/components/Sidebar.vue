<!-- src/components/Sidebar.vue -->
<template>
    <div :class="['sidebar', { collapsed }]">
      <!-- Toggle-Button als einfacher Button -->
      <button class="toggle-button" @click="toggleSidebar">
        {{ collapsed ? '>' : '<' }}
      </button>
      
      <ul class="menu">
        <li v-for="item in menuItems" :key="item.name" class="menu-item">
          <!-- Platzhalter für Icons (können später durch tatsächliche Icons ersetzt werden) -->
          <span class="menu-icon">🔹</span>
          <span v-if="!collapsed" class="menu-text">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  // Emit-Funktion definieren, um Events nach außen zu senden
  const emit = defineEmits(['toggle']);
  
  // Zustand der Sidebar (ausgeklappt oder eingeklappt)
  const collapsed = ref(false);
  
  // Menüelemente mit Namen und Platzhalter-Icons
  const menuItems = [
    { name: 'My Feed' },
    { name: 'Custom Feed' },
    { name: 'My Bookmarks' },
    { name: 'My Posts' },
    { name: 'Explore All' },
    { name: 'Contact' },
    { name: 'Terms' },
    { name: 'Logout' },
  ];
  
  // Funktion zum Umschalten der Sidebar
  const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
    emit('toggle', collapsed.value); // Zustand nach außen senden
  };
  </script>
  
  <style scoped>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    background-color: #2c3e50;
    color: #ecf0f1;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .sidebar.collapsed {
    width: 80px;
  }
  
  .toggle-button {
    margin: 20px 0;
    cursor: pointer;
    font-size: 1.2em;
    color: #ecf0f1;
    background: none;
    border: none;
    outline: none;
    transition: transform 0.3s ease;
  }
  
  /* Optional: Drehung des Buttons basierend auf dem Zustand */
  .toggle-button:hover {
    transform: scale(1.1);
  }
  
  .menu {
    list-style: none;
    padding: 0;
    width: 100%;
  }
  
  .menu-item {
    width: 100%;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #34495e;
  }
  
  .menu-icon {
    margin-right: 15px;
    min-width: 20px;
    text-align: center;
    font-size: 1.2em;
  }
  
  .sidebar.collapsed .menu-icon {
    margin-right: 0;
  }
  
  .menu-text {
    white-space: nowrap;
  }
  
  .sidebar.collapsed .menu-text {
    display: none;
  }
  
  @media screen and (max-width: 768px) {
    .sidebar {
      width: 80px;
    }
  
    .sidebar.collapsed {
      width: 0;
    }
  
    .toggle-button {
      margin: 10px 0;
    }
  
    .menu-item {
      padding: 10px 15px;
    }
  
    .menu-item {
      justify-content: center;
    }
  }
  </style>
  