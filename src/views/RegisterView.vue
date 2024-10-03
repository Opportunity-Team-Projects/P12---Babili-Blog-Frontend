<!-- <script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/AuthStore.js";
import router from "../router";

// useAuthStore importieren
const authStore = useAuthStore(); // Korrekte Zuweisung

const { register, getAuthUser} = useAuthStore();
   
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

const handleRegister = async () => {
  const resRegister = await register(
    {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  })
    if(resRegister.status !==201){
      return alert("Someting went wrong")
    }
    const resUser = await getAuthUser()

    if(resUser.status == 200) router.push("/dashboard")

};
</script> -->

<template>
<main>
    
    
    <form @submit.prevent="handleRegister">
        
        
    <div>
        <div class="header">
            <div class="logo">
                <img src="../assets/Nexus0.jpg" alt="Das Logo" class="logo">
            </div>
     
            <div>
                <p class="without-logging-in">Continue without logging in?</p>
            </div>
        </div>
    </div>
            <div class="text-container">
                <H1>Tech & Game Nexus</H1>
    
                <div class="text">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </p>
                </div>
            </div>

    <div class="container-regist">
        <div class="form-group">
            <label for="name">Name</label>
            <input class="placholder" type="text" id="name" name="name" v-model="name" required>
        </div>

        <div class="form-group">
            <label for="email">E-mail</label>
            <input class="placholder" type="email" id="email" name="email" v-model="email" required>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input class="placholder" type="password" id="password" name="password" v-model="password" required>
        </div>

        <div class="form-group">
            <label for="password_confirmation">Password</label>
            <input class="placholder" type="password" id="password_confirmation" name="password_confirmation" v-model="password_confirmation" required>
        </div>
    </div>
        
        <button type="submit">Register</button>
    </form>

    <div class="footer">
        <p>© 2024 Tech & Game Nexus       Terms</p>
    </div>
    

</main>
</template>

<style>
body {
  background-image: url('../assets/bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
@media (min-width: 768px) {
.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 117px;
  padding-top: 5%;
}
.without-logging-in{
  color: #FFFF;
  font-size: 16px;
}

.logo{
  width: 106px;
  height: 64px;
  border-radius: 40px;
  margin-left: 5%;
}
h1{
  color: #D7A8FC;
  padding-top: 22px;
  font-size: 32px;
}
.text{
  padding-top: 22px;
  color: #FFFF;
  width: 352px;
  font-size: 24px;
}
.container-regist{
    display: flex;
    flex-direction: column;
    color: #FFFF;
    width: 379px;
    height: 269px;
}
.form-group{
    display: flex;
    flex-direction: column;
}
.footer{
        color: #FFFF;
        display: flex;
        justify-content: center;
        bottom: 15px;
        position: fixed;
        width: 100%;
        font-size: 16px;
}

}
</style>