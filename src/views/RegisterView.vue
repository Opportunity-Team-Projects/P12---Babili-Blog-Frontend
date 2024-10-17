<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import router from "../router";

// useAuthStore importieren
const authStore = useAuthStore(); // Korrekte Zuweisung

const { register, getAuthUser } = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

const handleRegister = async () => {
  const resRegister = await register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  });
  if (resRegister.status !== 201) {
    return alert("Someting went wrong");
  }
  const resUser = await getAuthUser();

  if (resUser.status == 200) router.push("/dashboard");
};
</script>

<template>
  <main>
    <div class="registrierungs-container">
      <form @submit.prevent="handleRegister">
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
          <label for="email">E-mail</label>
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
          <label for="password_confirmation">Password</label>
          <input
            class="placholder"
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            v-model="password_confirmation"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  </main>
</template>
