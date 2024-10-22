<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import AuthService from "@/services/AuthService.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CookieBanner from "@/components/CookieBanner.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const authUser = ref(null);
const authStore = useAuthStore();

//TODO Löschen vor Launch
//Nur für Testzwecke
/* const user = ref({
  email: "estella33@example.org",
  password: "password",
}); */

onMounted(async () => {
  await authStore.fetchUser();
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});

const handleLogin = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    await authStore.login(payload); // Nutzung der Login-Methode aus dem Store
    if (authStore.isAuthenticated) {
      router.push("/"); // Weiterleitung nach erfolgreichem Login
    }
  } catch (err) {
    console.error(err);
    error.value = "Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.";
  }
};
</script>

<template>
  <div class="bodycontainer">

      <header>

        <div>
          <RouterLink to="/" class="without-logging-in"
            >Continue without logging in?</RouterLink
          >
        </div>
      </header>
      
    <div class="login-container">  

      <div class="text-container">
        <h1>Tech & Game Nexus</h1>
        <div class="text">
          <p>
            Der zentrale Treffpunkt, an dem Gaming und Technologie aufeinandertreffen - hier erfährst du 
            alles, was Gamer und Tech-Enthusiasten wissen müssen.
          </p>
        </div>
      </div>
      <form action="" method="post" @submit.prevent="handleLogin">
        <div class="login-container">
          <h2>Login</h2>
          <div>
            <div class="formgroup">
              <label for="email">Email</label>
              <input
                id="email"
                class="placeholder"
                type="email"
                name="email"
                v-model="email"
              />
            </div>
            <div class="formgroup">
              <label for="password">Password</label>
              <input
                id="password"
                class="placeholder"
                type="password"
                name="password"
                v-model="password"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="button-container">
            <div class="sign-up">
              <p class="haveacc">Don't have an account?</p>
              <RouterLink to="/register"
                ><button class="sign-button">Sign Up</button></RouterLink
              >
            </div>
            <div class="login-one-container">
              <RouterLink to="/register"
                ><p class="forgotpw">Forgot password?</p></RouterLink
              >
              <button class="login-button" type="submit">Login</button>
            </div>
          </div>
        </div>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
    <CookieBanner />

    <footer>
      
      <div class="footer-info">
        <div class="footer-left">
          <p>© 2024 Tech & Game Nexus</p>   
        </div>
        <RouterLink to="/terms" class="footer-right">    
          <p>Terms</p></RouterLink>

      </div>           

  </footer>
  </div>
</template>

<style scoped>
.bodycontainer {
  background-image: url("../assets/bg.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  /* Füge den Gradienten als zusätzliches Hintergrundbild hinzu */
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-right: 100px;
  padding-top: 3%;
}

.without-logging-in {
  color: #ffff;
  font-size: 16px;
}
.login-container {
  margin-left: 100px;
  max-width: 380px; 
}

h1 {
  font-family: "Audiowide", sans-serif;
  font-size: 32px;
  color: #d7a8fc;
  width: 100%;
}
.text {
  padding-top: 22px;
  color: #FFFF;
  width: 100%;
  font-size: 24px;
}

h2 {
  font-size: 24;
  font-weight: 900;
  color: white;
  margin-top: 30px;
  margin-bottom: 10px;
}

.login-container {
  margin-left: 100px;
  max-width: 380px;  
}

.formgroup {
  display: flex;
  flex-direction: column;
  width: 100%;
}

label {
  font-size: 18px;
  font-weight: 400;
  margin: 5px 0;
  color: #FFFF;
}

.placholder{
  width: 100%;
  height: 43px;
  border-radius: 5px;
  padding-left: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.sign-up {
  color: #ffff;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login-one-container {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 30px;
}
.sign-button {
  width: 107px;
  height: 34px;
  font-size: 20px;
  color: #ffff;
  background-color: black;
  border-radius: 10px;
}

.haveacc {
  font-size: 12px;
}

.forgotpw {
  font-size: 12px;
  color: #ffff;
  text-decoration: underline;
  text-decoration-color: white;
}
.login-button {
  width: 107px;
  height: 34px;
  background-color: #d7a8fc;
  border-radius: 10px;
  color: #ffff;
  font-size: 20px;
}

.footer-info{
  color: #FFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  font-size: 16px;
  gap: 40px;
  padding: 0 15px;
  margin-top: 10px;
  bottom: 0;
}

.footer-right {
  color: #ffff;
  font-size: 16px;
}

</style>
