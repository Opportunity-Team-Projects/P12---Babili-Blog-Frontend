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
    <div class="container">
      <div class="a">
        <div class="header">
          <div class="logo">
            <img src="../assets/Nexus0.jpg" alt="Das Logo" class="logo" />
          </div>
          <div>
            <RouterLink to="/" class="without-logging-in"
              >Continue without logging in?</RouterLink
            >
          </div>
        </div>
      </div>
      <div class="text-container">
        <H1>Tech & Game Nexus</H1>
        <div class="text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <form action="" method="post" @submit.prevent="handleLogin">
        <div class="login-container">
          <h2>Login</h2>
          <div>
            <div class="formgroup">
              <label class="email" for="email">E-Mail</label>
              <input
                id="email"
                class="placeholder"
                type="email"
                name="email"
                v-model="email"
              />
            </div>
            <div class="formgroup">
              <label class="email" for="password">Passwort</label>
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
          <div class="sign-up-container">
            <div class="sign-up">
              Don't have an account?
              <RouterLink to="/register" v-if="!authUser"
                ><button class="sign-button">Sign Up</button></RouterLink
              >
            </div>
            <div class="login-one-container">
              <RouterLink to="/register" v-if="!authUser"
                ><p class="forgot-password">Forgot password?</p></RouterLink
              >
              <button class="login-button" type="submit">Login</button>
            </div>
          </div>
        </div>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
    <CookieBanner />
    <div class="footer">
      <p>© 2024 Tech & Game Nexus Terms</p>
    </div>
  </div>
</template>

<style scoped>
.bodycontainer {
  background-image: url("../assets/bg.svg");
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
  height: 100vh;
}

@media (max-width: 767px) {
  .logo {
    width: 106px;
    height: 64px;
    border-radius: 40px;
    margin-left: 15%;
  }
  .header {
    display: flex;
    flex-direction: column;
    margin-top: 5%;
    color: #ffff;
  }
  .a {
    display: flex;
    justify-content: center;
  }
  h1 {
    color: #d7a8fc;
    size: 32px;
    display: flex;
    justify-content: center;
    font-size: 32px;
    padding-top: 5%;
    padding-bottom: 2%;
  }

  .text {
    color: #ffff;
    padding-left: 12%;
    padding-right: 10%;
    font-size: 24px;
  }
  h2 {
    padding-top: 5%;
    color: #ffff;
    font-size: 24px;
    display: flex;
    justify-content: center;
  }
  .formgroup {
    display: flex;
    flex-direction: column;
    color: #ffff;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2%;
  }
  .email {
    font-size: 20px;
    margin-bottom: 5px;
  }
  .placeholder {
    padding-left: 2%;
  }
  .sign-up-container {
    display: flex;
    flex-direction: row;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2%;
  }
  .sign-up {
    color: #ffff;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .login-one-container {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 10%;
  }
  .sign-button {
    width: 107px;
    height: 34px;
    font-size: 20px;
    color: #ffff;
    background-color: black;
    border-radius: 10px;
  }
  .login-button {
    width: 107px;
    height: 34px;
    background-color: #d7a8fc;
    border-radius: 10px;
    color: #ffff;
    font-size: 20px;
  }
  .footer {
    color: #ffff;
    display: flex;
    justify-content: center;
    bottom: 15px;
    position: fixed;
    width: 100%;
    font-size: 16px;
  }
}

@media (min-width: 768px) {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-right: 117px;
  }
  .without-logging-in {
    color: #ffff;
    font-size: 16px;
  }
  .container {
    padding-left: 174px;
    padding-top: 38px;
  }
  .logo {
    width: 106px;
    height: 64px;
    border-radius: 40px;
  }
  h1 {
    color: #d7a8fc;
    padding-top: 22px;
    font-size: 32px;
  }
  .text {
    padding-top: 22px;
    color: #ffff;
    width: 352px;
    font-size: 24px;
  }
  h2 {
    color: #ffff;
    padding-top: 22px;
    font-size: 24px;
  }
  .login-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 22px;
  }
  .email {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .formgroup {
    display: flex;
    flex-direction: column;
    color: #ffff;
  }
  .placeholder {
    width: 400px;
    padding-left: 10px;
  }
  .sign-up-container {
    display: flex;
    flex-direction: row;
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
  .forgot-password {
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
  .footer {
    color: #ffff;
    display: flex;
    justify-content: center;
    bottom: 15px;
    position: fixed;
    width: 100%;
    font-size: 16px;
  }
}
</style>
