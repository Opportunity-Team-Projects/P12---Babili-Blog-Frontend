//TODO Erfolgsmeldung einstellen,

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthService from "@/services/AuthService";
import { useAuthStore } from "@/stores/useAuthStore";

const route = useRoute();
const router = useRouter();

const token = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const message = ref("");
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchUser();
  console.log("isAuthenticated:", authStore.isAuthenticated);
  if (authStore.isAuthenticated) {
    router.push("/");
  } else {
    token.value = route.query.token || "";
    email.value = route.query.email || "";
  }
});

const submit = async () => {
  if (password.value !== password_confirmation.value) {
    message.value = "Die Passwörter stimmen nicht überein.";
    return;
  }

  if (password.value.length < 8) {
    message.value = "Das Passwort muss mindestens 8 Zeichen lang sein.";
    return;
  }

  try {
    const payload = {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    };
    await AuthService.resetPassword(payload);
    // Erfolgsmeldung anzeigen oder weiterleiten
    message.value =
      "Dein Passwort wurde erfolgreich zurückgesetzt. Du wirst zum Login weitergeleitet.";

    // Optional: Weiterleiten zur Login-Seite nach kurzer Verzögerung
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (e) {
    // Fehlerbehandlung
    if (e.response && e.response.data && e.response.data.errors) {
      const errors = Object.values(e.response.data.errors).flat().join(" ");
      if (errors.includes("This password reset token is invalid.")) {
        message.value = "Dieser Passwort-Reset-Token ist ungültig.";
      }
    } else if (e.response && e.response.data && e.response.data.message) {
      message.value = e.response.data.message;
    } else {
      message.value =
        "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";
    }
  }
};
</script>

<template>
  <div class="background-container">
    <div class="background-fader">
      <div class="content-wrapper">
        <main class="container">
          <h1 class="title">Tech & Game Nexus</h1>
          <p class="title-description">
            The central meeting point where gaming and technology meet - here you'll find out 
            everything gamers and tech enthusiasts need to know.
          </p>
          <h2 class="subtitle">Change Password</h2>
          <form @submit.prevent="submit">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
            <label for="password_confirmation">Password confirmation</label>
            <input
              type="password"
              id="password_confirmation"
              v-model="password_confirmation"
              required
            />
            <button type="submit">Send</button>
          </form>
          <div v-if="message" class="message">
            {{ message }}
          </div>
          <footer>
            <div class="footer-info">
              <div class="footer-left">
                <p>© 2024 Tech & Game Nexus</p>
              </div>
              <RouterLink to="/terms" class="footer-right"> <p>Terms</p></RouterLink>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* Desktop Styles (unchanged) */
.background-container {
  background-image: url("/register-bg.png");
  background-size: 107% 110%;
  background-position: -220px -75px;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  box-shadow: 0px 2px 6px 0px #0000001a, 0px 0px 2px 0px #00000014,
    0px 0px 0px 1px #00000033;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background-fader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 65%,
    rgba(0, 0, 0, 0.8) 75%,
    #000000 85%
  );
  display: flex;
  justify-content: flex-end;
}

.content-wrapper {
  margin-top: 135px;
  margin-right: 94px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 20px;
  font-family: "Roboto Slab", serif;
}

.container {
  width: 357px;
  display: flex;
  flex-direction: column;
  color: white;
}

.title {
  font-family: "Audiowide", sans-serif;
  font-size: 32px;
  color: #d7a8fc;
  padding-bottom: 36px;
}

.title-description {
  font-size: 24px;
  padding-bottom: 38px;
  line-height: 31px;
}

.subtitle {
  font-size: 24px;
  margin-top: 20px;
  font-weight: 800;
  margin-bottom: 44px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 400;
}

input {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  color: black;
  font-size: 16px;
  margin-bottom: 21px;
}

button {
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  border: 1px solid white;
  border-radius: 14px;
  background-color: black;
  color: white;
  cursor: pointer;
  width: 105px;
  height: 39px;
}

button:hover {
  background-color: white;
  color: black;
  border: solid 1px black;
}

.message {
  margin-top: 20px;
  color: #4caf50; /* Grün für erfolgreiche Nachrichten */
  font-size: 16px;
}

footer {
  margin-top: auto;
  font-size: 16px;
}

.footer-info {
  color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  gap: 40px;
  padding: 0 15px;
}

.footer-right {
  color: #ffff;
}

/* Mobile Styles */
@media screen and (max-width: 768px) {
  .background-container {
    background-size: cover;
    background-position: center;
  }

  .background-fader {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 15%,
    rgba(0, 0, 0, 0.9) 65%,
    #000000 100%
  );
}

  .content-wrapper {
    margin-top: 60px;
    margin-right: 0;
    justify-content: center;
    padding: 20px;
  }

  .container {
    width: 100%;
    max-width: 320px;
  }

  .title {
    font-size: 28px;
    padding-bottom: 24px;
  }

  .title-description {
    font-size: 18px;
    padding-bottom: 28px;
    line-height: 24px;
  }

  .subtitle {
    font-size: 22px;
    margin-top: 16px;
    margin-bottom: 32px;
  }

  label {
    font-size: 18px;
  }

  input {
    font-size: 14px;
    margin-bottom: 16px;
  }

  button {
    font-size: 18px;
    width: 100%;
    height: 36px;
  }

  footer {
    font-size: 14px;
  }
}
</style>
