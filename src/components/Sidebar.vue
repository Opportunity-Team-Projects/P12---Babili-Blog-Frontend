<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <button class="toggle-button" @click="toggleSidebar">
      <span class="triangle" :class="{ rotated: !isCollapsed }"></span>
    </button>

    <div class="sidebar-content">
      <ul class="menu main-menu">
        <li v-for="item in mainMenuItems" :key="item.name" class="menu-item">
          <router-link :to="item.path" class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon"></i>
            </span>
            <span v-if="!isCollapsed" class="menu-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>

      <ul class="menu bottom-menu">
        <li
          v-for="item in bottomMenuItems"
          :key="item.name"
          class="menu-item"
          @click="item.action"
        >
          <span class="menu-icon">
            <i :class="item.icon"></i>
          </span>
          <span v-if="!isCollapsed" class="menu-text">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push("/login"); // Passe die Route ggf. an deine Login-Seite an
};

const emit = defineEmits(["toggle"]);

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: true
  },
});

const isCollapsed = ref(props.collapsed);

watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal;
  }
);

const mainMenuItems = [
  { name: "Home", icon: "fas fa-home", path: "/" },
  { name: "My Feed", icon: "fas fa-list", path: "/my-feed" },
  { name: "My Bookmarks", icon: "fas fa-bookmark", path: "/my-bookmarks" },
  { name: "My Posts", icon: "fas fa-edit", path: "/my-posts" },
  { name: "Explore All", icon: "fas fa-compass", path: "/explore" },
  { name: "Contact", icon: "fas fa-envelope", path: "/contact" },
];

const bottomMenuItems = [
  { name: "Terms", icon: "fas fa-file-contract", path: "/terms" },
  { name: "Logout", icon: "fas fa-sign-out-alt", action: logout },
];

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle", isCollapsed.value);
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #0e1217;
  color: white;
  transition: width 0.3s ease, transform 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1001;
  box-shadow: 0 -1px 1px rgba(255, 255, 255, 0.3);
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.toggle-button {
  position: absolute;
  top: 100px;
  right: -10px;
  padding: 0;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  z-index: 1002;
  background-color: transparent;
  border: none;
}

.toggle-button:hover {
  transform: scale(1.1);
}

.triangle {
  width: 0;
  height: 0;
  padding: 0;
  background-color: #0e1217;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 20px solid violet;
  transition: transform 0.3s ease;
}

.triangle.rotated {
  transform: rotate(180deg);
}

.menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  width: 100%;
  margin: 0;
}

.main-menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bottom-menu {
  box-shadow: 0 -1px 5px rgba(255, 255, 255, 0.3);
  padding-top: 10px;
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
  background-color: rgba(151, 64, 151, 0.822);
}

.menu-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
}

.menu-link:hover {
  background-color: rgba(151, 64, 151, 0.822);
}

.menu-icon {
  margin-right: 15px;
  min-width: 20px;
  text-align: center;
  font-size: 1.2em;
  color: violet;
}

.menu-text {
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  .sidebar.collapsed {
    width: 60px;
  }
  .toggle-button {
    right: -15px;
    background-color: white;
    padding: 5px;
    border-radius: 50%;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
