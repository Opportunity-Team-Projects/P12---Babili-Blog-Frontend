<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo-placeholder">Logo
      </router-link>
    </div>
    <div class="header-center">
      <input type="text" class="search-bar" placeholder="Search...">
    </div>
    <div class="header-right">
      <router-link to="/create" class="new-post-btn">New Post
      </router-link>
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
  background-color: #0E1217;
  box-shadow: 0 -1px 5px rgba(255, 255, 255, 0.3);
}

.header-left, .header-center, .header-right {
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
  color: white;
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

@media screen and (max-width: 768px) {
  .app-header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
  }

  .header-left, .header-right {
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

  .dark-mode-toggle, .profile-icon {
    font-size: 1em;
  }
}

@media screen and (max-width: 480px) {
  .new-post-btn {
    padding: 8px 12px;
    font-size: 0.8em;
  }

  .dark-mode-toggle, .profile-icon {
    font-size: 0.9em;
  }
}
</style>