<template>
    <HeaderMain />
  
    <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />
  
    <div v-if="!isSidebarCollapsed" class="overlay" @click="handleToggle(true)"></div>
  
    <div class="main-content">

        <div class="profile-container">

            <div class="profile-content">

                <h1>Profile</h1>
                <div class="purple-line"></div>

                <section>
                    <h2>Profile picture</h2>

                    <p>Upload a picture to make your profile stand out and let people recognize 
                        your posts, comments and contributions easily!</p>
  
                    <div class="profileImage">
                        <!-- Hier Vorschaubild einfügen -->
                        <div v-if="profileImage" class="image-preview">
                            <img :src="profileImage" alt="Profile Picture" class="profile-picture"/>
                        </div>

                        <div class="image-upload" @click="triggerFileInput">
                            <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload">
                            <i class="fas fa-camera fa-2x"></i>
                            <span>Change profile picture</span>
                        </div>
                    </div>    
                </section>

                <section>

                    <h2>Account Information</h2>

                    <div>
                        <p>Joined date</p>
                    </div>
                    
                    <form @submit.prevent="submit">
                                    
                        <input
                            id="username" class="placeholder" type="text" name="username" placeholder="Username"
                            v-model="username">                        
                        
                        <input
                            id="email" class="placeholder" type="email" name="email" placeholder="Email"
                            v-model="email">
                        
                        <button type="submit" class="btn-1">Save changes</button>
                    </form>
                </section>

                <section>
                    <h2>Security</h2>

                    <p>Please enter your new password</p>

                    <form @submit.prevent="submit">
                        
                        <input type="password" class="placeholder" id="password" v-model="password" 
                        required placeholder="Password">
                        
                        <input type="password" class="placeholder" id="password_confirmation" placeholder="Password confirmation"
                        v-model="password_confirmation" required>
                        
                        <button type="submit" class="btn-2">Set password</button>
                    </form>
                </section>

                <section>
                    <h2>Delete account</h2>

                    <p>Deleting your account will:</p>
                    <br>
                    <ol>
                        <li>Permanently delete your profile, along with your authentication associations.</li>
                        <li>Permanently delete all your content, including your posts, bookmarks, comments, etc.</li>
                        <li>Allow your username to become available to anyone.</li>   
                    </ol>

                    <button @click="openDeleteModal(user.id)" class="btn-danger">Delete account</button>

                </section>
            </div>

        </div>

    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '@/services/AuthService';
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';
import DeleteModal from '@/components/DeleteModal.vue';

const router = useRouter();

const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Funktion zum Löschen des Benutzers
const deleteUser = (userId) => {
  axios.delete(`/api/users/${userId}`)
    .then(() => {
      // Logik nach erfolgreichem Löschen
      showDeleteModal.value = false;
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Funktion zum Öffnen des Delete-Modals
const openDeleteModal = (userId) => {
  userToDelete.value = userId; // Setzt die userId, die gelöscht werden soll
  showDeleteModal.value = true; // Öffnet das Modal
};

// Funktion zum Hochladen des Bildes und zum Anzeigen der Vorschau
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      post.value.contentImg = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
/* 
// Lädt das aktuelle Profilbild beim Laden der Seite
onMounted(async () => {
    try {
        const response = await authClient.get('/api/user/profile-image'); // Backend-Route für das Profilbild
        profileImage.value = response.data.profileImageUrl; // Profilbild-URL vom Server
    } catch (error) {
        console.error("Fehler beim Laden des Profilbildes:", error);
    }
}); */

/* // den Upload des Bildes an das Backend auslösen
const formData = new FormData();
formData.append('profile_picture', file);
authClient.post('/api/user/upload-profile-picture', formData)
    .then(response => console.log('Bild erfolgreich hochgeladen'))
    .catch(error => console.error('Fehler beim Hochladen:', error));
 */




</script>

<style scoped>

  .main-content {
    z-index: 1; 
    width: 100%;
    transition: all 0.3s ease;
    padding: 20px; 
    /* background-color: 0E1217; */
    background: radial-gradient(#3584e4 0%, #1a5fb4 15%, #1c71d8 34%, #241f31 62%, #000000 92%);
    /* background: radial-gradient(#62a0ea 0%, #1c71d8 28%, #1a5fb4 46%, #241f31 75%);     */
    color: white;
    display: flex;
    justify-content: center;
    padding-top: 43px;
    min-height: 100vh;
}

.profile-container {
    max-width: 680px;
    height: min-content;
    background-color: #1C1F26;
    border-radius: 8px;
    border: 1px solid #909090;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 0 10px;
}

.profile-content {
    width: 100%;
}

h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
}

.purple-line {
    height: 2px;
    background-color: #CE3DF3;
    margin-bottom: 20px;
}

h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 15px;
}

p {
    font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  margin: 20px 0;
}

.placeholder {
    padding-left: 2%;
}

section {
    margin: 40px 0;
}

.image-upload {
    width: 278px;
    height: 100px;
    border-radius: 25px;
    border-style: solid;
    border-color: #909090;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 20px;
}

input[type="text"],
input[type="email"],
input[type="password"]  {
    max-width: 320px;
    height: 35px;
    border-radius: 20px;
    border: solid 1px #FFFFFF;
    background-color: #20252D;
}

button[type="submit"],
.btn-danger {
    border-radius: 15px;
    border: solid 1px #000000;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    width: fit-content;
}    

.btn-danger {
    margin-top: 15px;
    background-color: #a80f33;
    color: #FFFFFF;
}

.btn-1 {
    background-color: #9E15D9;
    color: white;
}

.btn-2 {
    background-color: #FFFFFF;
}

.btn-danger:hover {
    color: #000000;
    cursor: pointer;
    background-color: #D91544;
}

.btn-1:hover {
    background-color: #d74cf6;
    color: #000000;
    cursor: pointer;
}

.btn-2:hover {
    background-color: #000000;
    color: #FFFFFF;
    border: solid 1px #FFFFFF;
    cursor: pointer;
}

</style>