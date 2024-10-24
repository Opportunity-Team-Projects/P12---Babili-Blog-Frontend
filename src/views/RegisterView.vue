<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import router from "../router";

// useAuthStore importieren
const authStore = useAuthStore(); // Korrekte Zuweisung

const { register } = useAuthStore();

const successMessage = ref("");
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

const handleRegister = async () => {
  try {
    // Registrierung durchführen
    const resRegister = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    if (resRegister.status !== 201) {
      return alert("Something went wrong with the registration");
    }

    // Erfolgsnachricht setzen
    successMessage.value = "Registration successful! Redirecting to login...";

    // Nach 2 Sekunden zur Login-Seite weiterleiten
    setTimeout(() => {
      successMessage.value = ""; // Erfolgsmeldung leeren (optional)
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred during registration");
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

    <div class="register-container">
      <div class="text-container">
        <h1>Tech & Game Nexus</h1>

        <div class="text">
          <p>
            The central meeting point where gaming and technology meet - here
            you'll find out everything gamers and tech enthusiasts need to know.
          </p>
        </div>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="container-regist">
          <h2>Register</h2>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              class="placholder"
              type="text"
              id="name"
              name="name"
              v-model="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              class="placholder"
              type="email"
              id="email"
              name="email"
              v-model="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              class="placholder"
              type="password"
              id="password"
              name="password"
              v-model="password"
              required
            />
          </div>

          <div class="form-group">
            <label for="password_confirmation">Confirm password</label>
            <input
              class="placholder"
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              v-model="password_confirmation"
              required
            />
          </div>
          <p v-if="successMessage" class="message">{{ successMessage }}</p>

          <div class="already">
            <p>Already have an account?</p>
          </div>

          <div class="button-container">
            <RouterLink to="/login"
              ><button class="login-button" type="button">
                Log in
              </button></RouterLink
            >
            <button class="btn-signup" type="submit">Sign up</button>
          </div>

          <div class="policy">
            <p>
              By signing up I accept the Terms of Service and the Privacy
              Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
    <footer>
      <div class="footer-info">
        <div class="footer-left">
          <p>© 2024 Tech & Game Nexus</p>
        </div>
        <RouterLink to="/terms" class="footer-right"> <p>Terms</p></RouterLink>
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
  display: flex;
  flex-direction: column;
  /* Füge den Gradienten als zusätzliches Hintergrundbild hinzu */
}

header {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-right: 100px;
  padding-top: 3%;
}

.register-container {
  margin-left: 100px;
  max-width: 380px;
}

.without-logging-in {
  color: #ffff;
  font-size: 16px;
}

h1 {
  font-family: "Audiowide", sans-serif;
  font-size: 32px;
  color: #d7a8fc;
  width: 100%;
}
.text {
  padding-top: 22px;
  color: #ffff;
  width: 100%;
  font-size: 24px;
}

h2 {
  font-size: 24px;
  font-weight: 900;
  color: white;
  margin-top: 30px;
  margin-bottom: 10px;
}
.container-regist {
  display: flex;
  flex-direction: column;
  color: #ffff;
  width: 100%;
  max-width: 380px;
  gap: 10px;
}
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

label {
  font-size: 18px;
  font-weight: 400;
  margin: 5px 0;
}

.placholder {
  width: 100%;
  height: 43px;
  border-radius: 5px;
  padding-left: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.btn-signup {
  width: fit-content;
  background-color: #9d67c7;
  color: #ffff;
  font-weight: 600;
  font-size: 16px;
  border-radius: 14px;
  text-align: center;
  padding: 10px 15px;
  border: solid 1px black;
}

.btn-signup:hover {
  background-color: #d7a8fc;
  color: black;
  cursor: pointer;
  border: solid 1px black;
}

.login-button {
  width: fit-content;
  font-weight: 600;
  font-size: 16px;
  color: #ffff;
  background-color: black;
  border-radius: 14px;
  text-align: center;
  padding: 10px 15px;
  cursor: pointer;
  border: solid 1px white;
}

.login-button:hover {
  background-color: white;
  color: black;
  border: black;
  cursor: pointer;
}

.already {
  font-size: 12px;
  margin-top: 10px;
}

.policy {
  margin-top: 15px;
  font-size: 12px;
}

footer {
  margin-top: auto;
}

.footer-info {
  color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  font-size: 16px;
  gap: 40px;
  padding: 0 15px;
  margin-top: 10px;
}

.footer-right {
  color: #ffff;
  font-size: 16px;
}

.message {
  margin-top: 20px;
  color: #4caf50; /* Grün für erfolgreiche Nachrichten */
  font-size: 16px;
}

@media (max-width: 768px) {
  .bodycontainer {
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.9) 15%,
        rgba(0, 0, 0, 0.75) 40%,
        rgba(0, 0, 0, 0) 100%
      ),
      url("../assets/bg.svg");
  }
}

@media (max-width: 580px) {
  .register-container {
    margin: 0 auto;
  }
  .text-container {
    text-align: center;
  }
  h2 {
    text-align: center;
  }
  header {
    justify-content: center;
    margin: 10px auto;
  }
  .bodycontainer {
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.9) 30%,
        rgba(0, 0, 0, 0.75) 60%,
        rgba(0, 0, 0, 0) 100%
      ),
      url("../assets/bg.svg");
  }
}

@media (max-width: 390px) {
  .register-container {
    margin: 0 5px;
  }
}
</style>
