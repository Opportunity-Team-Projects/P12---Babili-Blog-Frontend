//TODO wenn eingeloggt weiterleiten auf start

<script setup>
import { ref, onMounted } from "vue";
import AuthService from "@/services/AuthService";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const email = ref("");
const message = ref("");
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchUser();
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});

async function submitForgotPassword() {
  try {
    const payload = { email: email.value };
    await AuthService.forgotPassword(payload);
    message.value =
      "Dein Passwort wurde zurückgesetzt, und eine E-Mail wurde versendet.";
  } catch (error) {
    console.error("Error sending reset password email:", error);
    message.value = "Es ist ein Fehler aufgetreten. Bitte versuche es erneut..";
  }
}
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
          <h2 class="subtitle">Reset Password</h2>
          <form @submit.prevent="submitForgotPassword">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
            <button type="submit">Send</button>
          </form>
          <p v-if="message" class="message">{{ message }}</p>
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
/* Desktop Styles */
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
  margin-top: 20px;
}

label {
  margin-bottom: 18px;
  font-size: 20px;
  font-weight: 400;
}

input {
  padding: 10px;
  margin-bottom: 38px;
  border: none;
  border-radius: 5px;
  background-color: white;
  color: black;
  font-size: 16px;
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
    margin-bottom: 12px;
  }

  input {
    font-size: 14px;
    margin-bottom: 24px;
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
