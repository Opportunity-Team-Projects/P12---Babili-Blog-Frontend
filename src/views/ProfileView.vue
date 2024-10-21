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
                        
                          <button type="submit" class="btn-save" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : 'Save changes' }}
                          </button>

                      <p v-if="updateMessage" :class="{ 'success-message': !updateError, 'error-message': updateError }">
                        {{ updateMessage }}
                      </p>
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
                            <!-- Auge-Icon für Passwortsichtbarkeit -->
                          <font-awesome-icon 
                            :icon="passwordVisible ? 'eye-slash' : 'eye'" 
                            class="eye-icon"
                            @click="togglePasswordVisibility"
                          />
                        </div>
                        
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
                          <!-- Auge-Icon für Passwortsichtbarkeit -->
                          <font-awesome-icon 
                            :icon="passwordConfirmVisible ? 'eye-slash' : 'eye'" 
                            class="eye-icon"
                            @click="togglePasswordConfirmVisibility"
                          />
                        </div>
                        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                        <span class="error-message" v-if="errors.confirmation">{{ errors.confirmation }}</span>
                        
                      </div>
                      <!-- Button zum Öffnen des Modals -->
                      <div class="submit-section">
                        <button @click="openPasswordModal" class="btn-set">
                            Set Password</button>                         
                        
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

                    <button @click="openDeleteModal" class="btn-danger" :disabled="isDeletingAccount">
                      {{ isDeletingAccount ? 'Deleting...' : 'Delete account' }}
                    </button>
                </section>
            </div>

        </div>
    </div>


    <PasswordModal
      :isVisible="showPasswordModal"
      @confirm="submitPasswordChange"
      @close="closePasswordModal"
    />

    <DeleteModal 
      v-model="showDeleteModal"
      :isLoading="isDeletingAccount"
      @confirm="deleteUser" 
    />
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/useAuthStore";
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import CurrentPWModal from '@/components/CurrentPWModal.vue';

const router = useRouter();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const updateMessage = ref('');
const updateError = ref(false);

const isSidebarCollapsed = ref(true);

const showDeleteModal = ref(false);
const isDeletingAccount = ref(false);

const joinedDate = ref(''); // das Beitrittsdatum speichern

const authUser = ref({  // Benutzerinformationen hier speichern
    user: {
        name: '',
        email: '',
    }
}); 

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const password = ref('');
const password_confirmation = ref('');
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const showPasswordModal = ref(false);
const current_password = ref('');

const successMessage = ref('');
const isLoading = ref(false);
const errors = ref({
  password: '',
  confirmation: '',
  current_password: ''
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
    errors.value.password = 'The password must be at least 8 characters long';
    return false;
  }

  if (password.value !== password_confirmation.value) {
    errors.value.confirmation = 'The passwords do not match';
    return false;
  }

  if (!current_password.value) {
    errors.value.current_password = 'Current password is required';
    return false;
  }

  return true;
};

// Modal öffnen und schließen
const openCurrentPWModal = () => {
  showPasswordModal.value = true;
};

const closeCurrentPWModal = () => {
  showPasswordModal.value = false;
};

// Passwortänderung absenden, wenn das Modal bestätigt wurde
const submitPasswordChange = async (currentPassword) => {
  current_password.value = currentPassword;
  
  if (!validatePasswords()) {
    return;
  }

  isLoading.value = true;

  try {
    // API-Aufruf mit aktuellem Passwort und neuen Passwörtern
    await authStore.updatePassword({
      current_password: current_password.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    });

    successMessage.value = 'Password changed ';
    // Formular zurücksetzen
    current_password.value = '';
    password.value = '';
    password_confirmation.value = '';
    closeCurrentPWModal();
    
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Error saving password:', error.response.data);

      // Fehlernachrichten behandeln
      errors.value.password = error.response.data.message || 'Error saving password';
      
      if (error.response.data.errors) {
        if (error.response.data.errors.password) {
          errors.value.password = error.response.data.errors.password[0];
        }
        if (error.response.data.errors.password_confirmation) {
          errors.value.confirmation = error.response.data.errors.password_confirmation[0];
        }
        if (error.response.data.errors.current_password) {
          errors.value.current_password = error.response.data.errors.current_password[0]; // Aktuelles Passwort Fehler
        }
      }
    } else {
      // Generische Fehlermeldung
      errors.value.password = 'Error saving password';
      console.error('Error saving password:', error);
    }
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
      isSubmitting.value = true;
      updateError.value = false;
      updateMessage.value = '';
    

    // Sende die geänderten Daten an das Backend
      const userData = {
            name: authUser.value.user.name,
            email: authUser.value.user.email,
        };
    // Call the store method to update user
    await authStore.updateUser(userData);    

    // Erfolgsmeldung
    updateMessage.value = 'Profile updated successfully!';
    updateError.value = false;
    console.log("Profileinformation gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    updateMessage.value = 'Failed to update profile. Please try again.';
    updateError.value = true;
  } 
};

// Modal zum Löschen öffnen
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

// Funktion zum Löschen des Benutzers
const deleteUser = async () => {
  try {
    isDeletingAccount.value = true;
    
    await authStore.deleteAccount();
    showDeleteModal.value = false;
    
    // Redirect zur Login-Seite nach erfolgreichem Löschen
    router.push('/login');
  } catch (error) {
    console.error('Error deleting account:', error);
    alert(error.response?.data?.message || 'Failed to delete account. Please try again later.');
  } finally {
    isDeletingAccount.value = false;
  }
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

.success-message {
    color: #4CAF50;
    margin-top: 10px;
}

.error-message {
    color: #f44336;
    margin-top: 10px;
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

input.password-input {
  padding-right: 40px;  /* Platz für das Auge-Icon reservieren */
  padding-left: 4%;
}

/* Passwortfeld mit Auge-Icon */
.input-container {
  position: relative;
  width: 320px;
}

/* Stil für das SVG-Auge-Icon */
.eye-icon {
  position: absolute; 
  right: 10px;      /* Abstand von der rechten Seite des Containers */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ccc;
  z-index: 1;  /* Setzt das Icon in den Vordergrund */
}

button[type="submit"],
.btn-danger,
.btn-set {
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

.btn-save {
    background-color: #9E15D9;
    color: white;
}

.btn-set {
    background-color: #FFFFFF;
}

.btn-danger:hover {
    color: #000000;
    cursor: pointer;
    background-color: #D91544;
}

.btn-save:hover {
    background-color: #d74cf6;
    color: #000000;
    cursor: pointer;
}

.btn-set:hover {
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