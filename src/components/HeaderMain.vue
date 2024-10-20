<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/" >
        <img src="@/../public/logo-round.png" class="logo">
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
      <router-link v-if="authUser" to="/create" class="new-post-btn">New Post</router-link>
      <router-link v-if="authUser" to="/profile" custom v-slot="{ navigate }">
        <div class="profile-icon" @click="navigate" role="link">
          <i class="fas fa-user"></i>
        </div>
      </router-link>

      <!-- Zeigt "Login" und "Sign up" nur an, wenn der Nutzer nicht eingeloggt ist -->
      <router-link v-if="!authUser" to="/login" class="log-in-btn">Log in</router-link>
      <router-link v-if="!authUser" to="/register" class="sign-up-btn">Sign up</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import debounce from "lodash.debounce";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

const searchQuery = ref("");
const router = useRouter();
const route = useRoute();
const { authUser } = storeToRefs(useAuthStore());

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
  try {
    const user = await AuthService.getCurrentUser(); // Verwende die Methode aus AuthService
    if (user) {
      isAuthenticated.value = true; // Benutzer ist eingeloggt
    }
  } catch (error) {
    isAuthenticated.value = false; // Benutzer ist nicht eingeloggt oder Authentifizierung fehlgeschlagen
  }
});
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

.new-post-btn, .log-in-btn {
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
  text-decoration: none;
  margin-right: 30px;
}

.new-post-btn:hover,
.log-in-btn:hover {
  background-color: white;
  color: black;
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
