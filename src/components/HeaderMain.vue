<template>
  <header class="app-header">
    <div class="header-left">
      <button class="logo-placeholder">Logo</button>
    </div>
    <div class="header-center">
      <input
        type="text"
        class="search-bar"
        placeholder="Search..."
        v-model="searchQuery"
        @input="onSearchInput"
      />
    </div>
    <div class="header-right">
      <button class="new-post-btn">New Post</button>
      <button class="dark-mode-toggle">
        <i class="fas fa-moon"></i>
      </button>
      <div class="profile-icon">
        <i class="fas fa-user"></i>
      </div>
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

//TODO Prüfe ob noch benötigit
//const emit = defineEmits(["search"]);

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
    router.push({ name: "home", query: { q: searchQuery.value } });
  } else {
    router.push({ name: "home" });
  }
}, 300);
</script>

<style scoped>
.app-header {
  z-index: 1002;
  position: sticky;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #0e1217;
  box-shadow: 0 -1px 5px rgba(255, 255, 255, 0.3);
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.logo-placeholder {
  padding: 10px 20px;
  background-color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-bar {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.new-post-btn {
  padding: 14px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;
}

.dark-mode-toggle {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  margin-right: 10px;
}

.profile-icon {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
