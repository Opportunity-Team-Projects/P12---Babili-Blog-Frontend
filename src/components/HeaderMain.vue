<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/">
        <img src="@/../public/logo-round.png" class="logo" />
      </router-link>
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
      <!-- Zeigt "New Post" und "Profile" nur an, wenn der Nutzer eingeloggt ist -->
      <router-link v-if="isAuthenticated" to="/create" class="new-post-btn"
        >New Post</router-link
      >
      <router-link
        v-if="isAuthenticated"
        to="/profile"
        custom
        v-slot="{ navigate }"
      >
        <div class="profile-image" @click="navigate" role="link">
          <img :src="profileImage" alt="Profile Picture" class="profile-icon" />
        </div>
      </router-link>

      <!-- Zeigt "Login" und "Sign up" nur an, wenn der Nutzer nicht eingeloggt ist -->
      <router-link v-if="!isAuthenticated" to="/login" class="log-in-btn"
        >Log in</router-link
      >
      <router-link v-if="!isAuthenticated" to="/register" class="sign-up-btn"
        >Sign up</router-link
      >
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import debounce from "lodash.debounce";
import { useAuthStore } from "@/stores/useAuthStore";

const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const { profileImage } = useAuthStore();
const authStore = useAuthStore();

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

// API-Aufruf, um den aktuellen Benutzerstatus zu prüfen
onMounted(async () => {
  await authStore.fetchUser(); // Hole den Benutzerstatus beim Laden der Komponente
});

// Reaktive Berechnung, ob der Nutzer eingeloggt ist
const isAuthenticated = authStore.isAuthenticated;
</script>

<style scoped>
.app-header {
  z-index: 1002;
  position: sticky;
  top: 0;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  background: linear-gradient(
    0deg,
    #241f31 0%,
    #613583 20%,
    #813d9c 50%,
    #613583 80%,
    #241f31 100%
  );

  /* background-color: #0e1217; */
  /*   box-shadow: 0 -1px 5px rgba(206, 61, 243, 0.8); */
}
.header-center {
  justify-content: center;
}
.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.logo {
  width: 250px;
  height: 60px;
  cursor: pointer;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: white;
}

.search-bar {
  background: transparent;
  border: solid 1px;
  color: white;
  width: 500px;
  padding: 10px 10px 10px 35px;
  border: 1px solid rgba(255, 255, 255, 0.678);
  border-radius: 14px;
}

.search-bar::placeholder {
  color: rgba(255, 255, 255, 0.712);
}

.new-post-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  background-color: #1c1f26;
  color: white;
  border: solid 1px rgba(238, 130, 238, 0.473);
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  margin-right: 30px;
  transition: all 0.3s ease;
}

.new-post-btn:hover {
  border: solid 1px violet;
}

.sign-up-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: white;
  color: black;
  border: solid 1px;
  border-radius: 15px;
  border-color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}
.sign-up-btn:hover {
  background-color: black;
  color: white;
}

.profile-image {
  width: 60px;
  height: 60px;
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

@media screen and (max-width: 1110px) {
  .search-container {
    right: 0;
  }

  .search-bar {
    width: 300px;
  }
}

@media screen and (max-width: 810px) {
  .app-header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .header-left,
  .header-right {
    width: 100%;
    justify-content: space-evenly;
  }

  .header-center {
    order: 3;
    width: 100%;
    margin-top: 10px;
  }

  .search-container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 500px;
    position: relative;
    margin: 0 auto;
  }

  .search-bar {
    width: 100%;
    max-width: 500px;
    color: white;
  }

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    z-index: 1;
  }
}
</style>
