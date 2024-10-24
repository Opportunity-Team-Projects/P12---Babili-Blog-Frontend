<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <ul class="menu main-menu">
        <!-- Verwende die gefilterten Hauptmenüelemente -->
        <li
          v-for="item in filteredMainMenuItems"
          :key="item.name"
          class="menu-item"
        >
          <router-link :to="item.path" class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="menu-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>

      <ul class="menu bottom-menu">
        <li v-for="item in bottomMenuItems" :key="item.name" class="menu-item">
          <router-link v-if="item.path" :to="item.path" class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="menu-text">{{ item.name }}</span>
          </router-link>
          <div v-else @click="item.action" class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="menu-text">{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

const mainMenuItems = [
  {
    name: "Explore All",
    icon: "fas fa-compass",
    path: "/",
    requiresAuth: true,
  },
  {
    name: "Custom Feed",
    icon: "fas fa-list",
    path: "/my-feed",
    requiresAuth: true,
  },

  {
    name: "Bookmarks",
    icon: "fas fa-bookmark",
    path: "/bookmarks",
    requiresAuth: true,
  },
  {
    name: "My Posts",
    icon: "fas fa-edit",
    path: "/my-posts",
    requiresAuth: true,
  },
];

// Berechnete Eigenschaft, die die Menüelemente basierend auf Authentifizierung filtert
const filteredMainMenuItems = computed(() => {
  return mainMenuItems.filter((item) => {
    if (item.requiresAuth) {
      return authStore.isAuthenticated;
    }
    return true;
  });
});

const bottomMenuItems = [
  { name: "Contact", icon: "fas fa-envelope", path: "/contact" },
  { name: "Terms", icon: "fas fa-file-contract", path: "/terms" },
  { name: "Logout", icon: "fas fa-sign-out-alt", action: logout },
];
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 66px;
  background-color: #1c1f26;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 14px;

  color: white;
  transition: width 0.5s cubic-bezier(0.25, 0.1, 0.15, 1);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.sidebar:hover {
  width: 180px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 20px 0 0 0;
}

.main-menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0;
}

.bottom-menu {
  padding-bottom: 20px;
}

.menu {
  list-style: none;
  padding: 0;
  width: 100%;
  margin: 0;
}

.menu-item {
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(151, 64, 151, 0.822);

  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.menu-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
}

.menu-icon {
  min-width: 20px;
  text-align: center;
  font-size: 1.2em;
  color: #ce3df3;
  margin-right: 15px;
  transition: color 0.3s ease;
}

.menu-text {
  white-space: nowrap;
  display: none;
  transition: none;
  transition: color 0.3s ease;
}

.sidebar:hover .menu-text {
  display: inline;
}

@media screen and (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  .sidebar:hover {
    width: 200px;
  }
}
</style>
