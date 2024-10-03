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
    
    
  <div class="container">  
    
    <div class="header">
      <div class="logo">
        <img src="../assets/Nexus0.jpg" alt="Das Logo" class="logo">
      </div>
      <div>
        <p class="without-logging-in">Continue without logging in?</p>
      </div>
    </div>
    
    <div>
      <H1>Tech & Game Nexus</H1>
    
      <div class="text">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        </p>
      </div>
    </div>
    
    <div class="login-container">
      <h2>Login</h2>
      <div class="formgroup">
        <label class="email" for="">E-Mail</label>
        <input class="placeholder" type="email" name="email" v-model="user.email" />
      </div>

      <div class="formgroup">
        <label class="email" for="">Passwort</label>
        <input class="placeholder" type="password" name="password" v-model="user.password" />
      </div>
    </div>
<div>
    <div class="sign-up-container">
      <div class="sign-up">
          Don't have an account?
          <RouterLink to="/register" v-if="!authUser"><button class="sign-button">Sign Up</button></RouterLink>
      </div>
      <div class="login-one-container">
        <RouterLink to="/register" v-if="!authUser"><p class="forgot-password">Forgot password?</p></RouterLink>
        <button  class="login-button" type="submit">Login</button>
      </div>
    </div>
</div>  
  </div> 

  <div class="footer">
    <p>© 2024 Tech & Game Nexus       Terms</p>
  </div>
    

  </form>
</template>

<style>

body {
  background-image: url('../assets/bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 117px;
}
.without-logging-in{
  color: #FFFF;
  font-size: 16px;
}
.container{
  padding-left: 174px;
  padding-top: 38px;
}
.logo{
  width: 106px;
  height: 64px;
  border-radius: 40px;

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
h2{
  color: #FFFF;
  padding-top: 22px;
  font-size: 24px;
}
.login-container{
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 22px;
  
}
.email{
  font-size: 20px;
  margin-bottom: 5px;
}

.formgroup{
  display: flex;
  flex-direction: column;
  color: #FFFF;
}
.placeholder{
  width: 400px;
  height: 43px;
  border-radius: 10px;
  padding-left: 20px;

}
.sign-up-container{
  display: flex;
  flex-direction: row;
}
.sign-up{
  color: #FFFF;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login-one-container{
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 30px;

}
.sign-button{
  width: 107px;
  height: 34px;
  font-size: 20px;
  color: #FFFF;
  background-color: black;
  border-radius: 10px;
}
.forgot-password{
  color: #FFFF;
  text-decoration: underline;
  text-decoration-color: white;
}
.login-button{
  width: 107px;
  height: 34px;
  background-color: #D7A8FC;
  border-radius: 10px;
  color: #FFFF;
  font-size: 20px;
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


</style>
