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

<div class="bodycontainer">
    
  <div class="register-container">
    <form @submit.prevent="handleRegister">
        
        
    <div>
        <div class="header">
            <div class="logo">
                <img src="" alt="" class="logo">
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
            <label for="name">Name:</label>
            <input class="placholder" type="text" id="name" name="name" v-model="name" required>
        </div>

        <div class="form-group">
            <label for="email">E-mail:</label>
            <input class="placholder" type="email" id="email" name="email" v-model="email" required>
        </div>

        <div class="form-group">
            <label for="password">Password:</label>
            <input class="placholder" type="password" id="password" name="password" v-model="password" required>
        </div>

        <div class="form-group">
            <label for="password_confirmation">Confirm password:</label>
            <input class="placholder" type="password" id="password_confirmation" name="password_confirmation" v-model="password_confirmation" required>
        </div>
     

    
      <div>
        <p>Already have an account?</p>
      </div> 

      <div class="button-container"> 
        <RouterLink to="/login" v-if="!authUser"><button class="login-button">Login</button></RouterLink>
        <button class="button" type="submit">Sign Up</button>
      </div> 
      
      <div class="policy">
        <p>By signing up I accept the Terms of Service and the Privacy Policy.</p>
      </div>
    
    </div> 
    
  </form>
    <div>
      <div class="footer">
        <p>© 2024 Tech & Game Nexus       Terms</p>
      </div>
    </div>
  </div>   

</div>
</template>

<style scoped>
.bodycontainer {
  background-image: url('../assets/bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}

  .register-container{
  margin-left: 117px;
  
}
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
  padding-top: 30px;
  gap: 10px;
}
.form-group{
    display: flex;
    flex-direction: column;
}
.placholder{
  width: 379px;
  height: 43px;
  border-radius: 10px;
  padding-left: 15px;
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
.button-container{
  display: flex;
        

}
.button{
  height: 34px;
  width: 107px;
  background-color: #D7A8FC;
  border-radius: 10px;
  color: #FFFF;
  margin-left: 170px;
}
.login-button{
  width: 107px;
  height: 34px;
  font-size: 20px;
  color: #FFFF;
  background-color: black;
  border-radius: 10px;
}
.policy{
  padding-top: 10px;
}
</style>

