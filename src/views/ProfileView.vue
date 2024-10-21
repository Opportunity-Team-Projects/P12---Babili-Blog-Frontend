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
                        <div class="image-preview">
                            <img 
                                :src="profileImage || '../user-profile-icon.jpg'" 
                                :alt="profileImage ? 'Profile Picture' : 'Default Profile Picture'"
                                class="profile-picture"
                            />
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
                        <p>Joined date: {{ joinedDate }}</p>
                    </div>
                    
                    <form @submit.prevent="submit">
                      <input
                          id="username" 
                          class="placeholder" 
                          type="text" 
                          name="username" 
                          v-model="authUser.user.name">
                      
                      <input
                          id="email" 
                          class="placeholder" 
                          type="email" 
                          name="email" 
                          v-model="authUser.user.email">
                        
                        <button type="submit" class="btn-1">Save changes</button>
                    </form>
                </section>

                <section>
                    <h2>Security</h2>

                    <p>Please enter your new password</p>

                    <form @submit.prevent="handleSubmit" class="password-form">
                      <div class="input-group">
                        <div class="input-container">
                          <input
                            :type="passwordVisible ? 'text' : 'password'"
                            class="placeholder password-input"
                            id="password"
                            v-model="password"
                            required
                            placeholder="Password"
                            minlength="8"
                          />
                          <i 
                            class="fas eye-icon" 
                            :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'" 
                            @click="togglePasswordVisibility"
                          ></i>
                        </div>
                        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                      </div>

                      <div class="input-group">
                        <div class="input-container">
                          <input 
                            :type="passwordConfirmVisible ? 'text' : 'password'"
                            class="placeholder password-input"
                            id="password_confirmation"
                            v-model="password_confirmation"
                            required
                            placeholder="Password confirmation"
                            minlength="8"
                          />
                          <i 
                            class="fas eye-icon" 
                            :class="passwordConfirmVisible ? 'fa-eye-slash' : 'fa-eye'" 
                            @click="togglePasswordConfirmVisibility"
                          ></i>
                        </div>
                        <span class="error-message" v-if="errors.confirmation">{{ errors.confirmation }}</span>
                      </div>

                      <div class="submit-section">
                        <button 
                          type="submit" 
                          class="btn-2"
                          :disabled="isLoading"
                        >
                          {{ isLoading ? 'Saving...' : 'Save' }}
                        </button>
                        
                        <span class="success-message" v-if="successMessage">{{ successMessage }}</span>
                      </div>
                  </form>
                </section>

                <section>
                    <h2>Delete account</h2>

                    <p>Deleting your account will:</p>
                    <br />
                    <ol>
                        <li>Permanently delete your profile, along with your authentication associations.</li>
                        <li>Permanently delete all your content, including your posts, bookmarks, comments, etc.</li>
                        <li>Allow your username to become available to anyone.</li>   
                    </ol>

                    <button @click="openDeleteModal(authUser.id)" class="btn-danger">Delete account</button>
                </section>
            </div>

        </div>
    </div>

    <DeleteModal 
    v-model="showDeleteModal"
    @confirm="deleteUser(authUser?.id)" 
    />
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/useAuthStore";
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';
import DeleteModal from '@/components/DeleteModal.vue';

const router = useRouter();
const authStore = useAuthStore();


const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const isSidebarCollapsed = ref(true);
const showDeleteModal = ref(false);
const joinedDate = ref(''); // das Beitrittsdatum speichern

const authUser = ref({  // Benutzerinformationen hier speichern
    user: {
        name: '',
        email: ''
    }
}); 

const password = ref('');
const password_confirmation = ref('');
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const isLoading = ref(false);
const successMessage = ref('');
const errors = ref({
  password: '',
  confirmation: ''
});

const profileImage = ref(null);

// Funktion zum Umschalten der Passwortsichtbarkeit
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const togglePasswordConfirmVisibility = () => {
  passwordConfirmVisible.value = !passwordConfirmVisible.value;
};

const validatePasswords = () => {
  errors.value = {
    password: '',
    confirmation: ''
  };

  if (password.value.length < 8) {
    errors.value.password = 'Das Passwort muss mindestens 8 Zeichen lang sein';
    return false;
  }

  if (password.value !== password_confirmation.value) {
    errors.value.confirmation = 'Die Passwörter stimmen nicht überein';
    return false;
  }

  return true;
};

// Passwortänderung übermitteln
const handleSubmit = async () => {
  successMessage.value = '';
  
  if (!validatePasswords()) {
    return;
  }

  isLoading.value = true;

  try {
    await authStore.updatePassword({
      password: password.value,
      password_confirmation: password_confirmation.value
    });

    successMessage.value = 'Password changed ';
    // Formular zurücksetzen
    password.value = '';
    password_confirmation.value = '';
    
  } catch (error) {
    errors.value.password = 'Fehler beim Speichern des Passworts';
    console.error('Fehler beim Speichern des Passworts:', error);
  } finally {
    isLoading.value = false;
  }
};

// Benutzerdaten beim Laden der Seite abrufen
onMounted(async () => {
    try {
        await authStore.fetchUser();
        // Ensure we're creating a proper structure
        authUser.value = {
            user: {
                name: authStore.user?.user?.name || '',
                email: authStore.user?.user?.email || '',
                created_at: authStore.user?.user?.created_at
            }
        };
        
        // Format join date
        if (authUser.value.user?.created_at) {
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            };
            joinedDate.value = new Date(authUser.value.user.created_at)
                .toLocaleDateString('de-DE', options);
        }
    } catch (error) {
        console.error('Fehler beim Laden des Users:', error);
    }
});

// Funktion zum Speichern von Änderungen (Name und E-Mail)
const submit = async () => {
  try {
    // Überprüfe ob Daten vorhanden sind
    if (!authUser.value.user) {
      console.error('Keine Benutzerdaten vorhanden');
      return;
    }

    // Sende die geänderten Daten an das Backend
    await authStore.updateUser({
      name: authUser.value.user.name,
      email: authUser.value.user.email,
    });

    // Erfolgsmeldung
    console.log("Profileinformation gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
  }
};

// Modal zum Löschen öffnen
const openDeleteModal = (userId) => {
  showDeleteModal.value = true;
};

// Funktion zum Löschen des Benutzers
const deleteUser = (userId) => {
    AuthService.delete(`/api/users/${userId}`)
    .then(() => {
      showDeleteModal.value = false;
      router.push('/login'); // Nach dem Löschen zur Login-Seite navigieren
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Funktion zum Hochladen des Bildes und zum Anzeigen der Vorschau
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      await authStore.uploadProfilePicture(formData);
      // Erfolgsmeldung anzeigen
    } catch (error) {
      // Fehlerbehandlung
    }
  }
};

// Lädt das aktuelle Profilbild beim Laden der Seite
/* onMounted(async () => {
    try {
        const response = await authClient.get('/api/user/profile-image'); // Backend-Route für das Profilbild
        profileImage.value = response.data.profileImageUrl; // Profilbild-URL vom Server
    } catch (error) {
        console.error("Fehler beim Laden des Profilbildes:", error);
    }
}); */

// den Upload des Bildes an das Backend auslösen
/* const formData = new FormData();
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
    padding: 15px;
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

.profileImage {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-top: 30px;
}

.image-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #909090;
}

.profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    width: 250px;
    height: 100px;
    border-radius: 25px;
    border-style: solid;
    border-color: #909090;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
    margin-top: 20px;
}

input[type="text"],
input[type="email"],
input[type="password"]  {
    width: 320px;
    height: 35px;
    border-radius: 20px;
    border: solid 1px #FFFFFF;
    background-color: #20252D;
    position: relative;
    color: white;
}

/* Passwortfeld mit Auge-Icon */
.input-container {
  position: relative;
}

/* Auge-Icon */
i.fas {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ccc;
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

@media (max-width: 500px) {
    .profileImage {
        display: flex;
        flex-direction: column;
    }
}

@media (max-width: 500px) {
.profile-container {
  margin: 0 5px;
  }
}

</style>