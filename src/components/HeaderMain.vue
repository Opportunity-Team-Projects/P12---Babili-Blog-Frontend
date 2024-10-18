<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo-placeholder">Logo</router-link>
    </div>
    <div class="header-center">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          v-model="searchQuery"
          @input="onSearchInput"
        />
      </div>
    </div>
    <div class="header-right">
      <router-link to="/create" class="new-post-btn">New Post</router-link>

      <router-link to="/profile" custom v-slot="{ navigate }">
        <div class="profile-icon" @click="navigate" role="link">
          <i class="fas fa-user"></i>
        </div>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import debounce from "lodash.debounce";

const searchQuery = ref("");
const router = useRouter();
const route = useRoute();

// Damit das Suchfeld den aktuellen Wert aus der URL anzeigt
searchQuery.value = route.query.q || "";

// Beobachtet Änderungen in der Route und aktualisiert das Suchfeld
watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || "";
  }
);

// Funktion, die aufgerufen wird, wenn der Benutzer etwas in das Suchfeld eingibt
const onSearchInput = debounce(() => {
  if (searchQuery.value) {
    router.push({ path: route.path, query: { q: searchQuery.value } });
  } else {
    router.push({ path: route.path });
  }
}, 300);
</script>

<style scoped>
.app-header {
  z-index: 1002;
  position: sticky;
  top: 0;
  height: 84px;
  display: flex;

  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #0e1217;
  box-shadow: 0 -1px 5px rgba(206, 61, 243, 0.8);
}

.header-left,
.header-center,
.header-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logo-placeholder {
  padding: 10px 20px;
  background-color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  right: -10%;
}

.search-icon {
  position: absolute;
  left: 10px;

  color: white;
}

.search-bar {
  background-color: #20252d;
  border: solid 1px;
  color: white;
  width: 500px;
  padding: 10px 10px 10px 35px;
  border: 1px solid white;
  border-radius: 14px;
}

.new-post-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: black;
  color: white;
  border: solid 1px;
  border-radius: 15px;
  border-color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.dark-mode-toggle {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  margin-right: 10px;
  color: white;
}

.profile-icon {
  width: 60px;
  height: 60px;
  background-color: black;
  border: solid 2px #ce3df3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 30px;
}

.profile-icon:hover {
  background-color: #909090;
  border: solid 2px white;
}

@media screen and (max-width: 768px) {
  .app-header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
  }

  .header-left,
  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .header-center {
    order: 3;
    width: 100%;
    margin-top: 10px;
  }

  .search-bar {
    width: 100%;
  }

  .new-post-btn {
    padding: 10px 15px;
    font-size: 0.9em;
  }

  .dark-mode-toggle,
  .profile-icon {
    font-size: 1em;
  }
}

@media screen and (max-width: 480px) {
  .new-post-btn {
    padding: 8px 12px;
    font-size: 0.8em;
  }

  .dark-mode-toggle,
  .profile-icon {
    font-size: 0.9em;
  }
}
</style>
