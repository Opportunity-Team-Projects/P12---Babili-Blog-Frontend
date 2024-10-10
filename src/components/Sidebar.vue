<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <ul class="menu main-menu">
        <li v-for="item in mainMenuItems" :key="item.name" class="menu-item">
          <router-link :to="item.path" class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="menu-text">{{ item.name }}</span>
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
          <span class="menu-text">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

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
</script>


<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 66px;
  background-color: rgba(14, 18, 23, 0.90);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 14px;

  color: white;
  transition: width 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.sidebar:hover {
  width: 200px;
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

}



.menu-item:hover {
  background-color: rgba(151, 64, 151, 0.822);
  border-radius: 4px;
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
  color: #CE3DF3;
  margin-right: 15px;
}

.menu-text {
  white-space: nowrap;
  display: none;
  transition: none;
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