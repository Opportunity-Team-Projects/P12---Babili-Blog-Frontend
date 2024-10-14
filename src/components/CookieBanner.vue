
<template>

    <transition name="fade">
        <div v-if="showBanner" class="cookie-banner">
            <img src="@/assets/cookie.svg" alt="Cookie Info" class="banner-image" />
            <p>This website uses cookies to give you the best possible experience</p>
           
                <button @click="acceptCookies" class="btn-acc">ACCEPT ALL</button>
                <button @click="declineCookies" class="btn-dec">ACCEPT ONLY NECESSARY</button>
            
        </div>
    </transition>

</template>

<script setup>

import { ref, onMounted } from 'vue';

// Reactive state for showing/hiding the cookie banner
const showBanner = ref(false);

// Method to handle accepting cookies
const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', true);
  showBanner.value = false;
};

// Method to handle declining cookies
const declineCookies = () => {
  showBanner.value = false;
};

// Lifecycle hook to check if the user has already accepted cookies
onMounted(() => {
  if (!localStorage.getItem('cookiesAccepted')) {
    // Show the banner after a delay of 1 seconds
    setTimeout(() => {
      showBanner.value = true;
    }, 1000);
  }
});
</script>

<style scoped>

.banner-image {
    align-self: center;
}

p {
    font-size: 12px;
    font-weight: 700;
}

.cookie-banner {
  position: fixed;
  bottom: 40px; 
  right: 40px;  
  width: 240px; 
  height: 400px; 
  background-color: #0E1217;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  opacity: 0.8;
}

.btn-acc {
  background-color: #22C3E6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-acc:hover {
  background-color: #08596c;
}

.btn-dec {
  background-color: #E1E5E9;
  border: none;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.btn-dec:hover {
    background-color: #7a909b;
}
</style>