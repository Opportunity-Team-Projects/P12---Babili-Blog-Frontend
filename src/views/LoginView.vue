<script setup>
import AuthService from "@/services/AuthService.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref({
  email: "estella33@example.org",
  password: "password",
});

const login = async () => {
  try {
    await AuthService.login(user.value);
    const response = await AuthService.getAuthUser();
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <form action="" method="post" @submit.prevent="login">
    <div class="formgroup">
      <label for="">E-Mail</label>
      <input type="email" name="email" v-model="user.email" />
    </div>

    <div class="formgroup">
      <label for="">Passwort</label>
      <input type="password" name="password" v-model="user.password" />
    </div>

    <button type="submit">Login</button>
  </form>
</template>
