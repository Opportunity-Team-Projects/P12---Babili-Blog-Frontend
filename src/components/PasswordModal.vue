<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal">
          
        <div class="modal-content">

            <h2>Please enter current password</h2>

            <div class="input-container">    
                <input
                    :type="currentPasswordVisible ? 'text' : 'password'"
                    class="placeholder password-input"
                    v-model="current_password"
                    required
                    placeholder="Current Password"
                    @keyup.enter="submit"
                />
        
                <font-awesome-icon 
                    :icon="currentPasswordVisible ? 'eye-slash' : 'eye'" 
                    class="eye-icon"
                    @click="toggleCurrentPasswordVisibility"
                />
            </div>
        </div>
        
        <div class="btns">
            <button @click="cancel" class="btn-cancel" :disabled="isSubmitting">
            Cancel
            </button>
            <button @click="submit" class="btn-confirm" :disabled="isSubmitting || !current_password">
            Confirm
            
            </button>
        </div>    
      </div>
    </div>
  </template>

<script setup>
import { ref, } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['confirm', 'close']);

const current_password = ref('');
const currentPasswordVisible = ref(false);

// Umschalten der Sichtbarkeit für das aktuelle Passwort
const toggleCurrentPasswordVisibility = () => {
  currentPasswordVisible.value = !currentPasswordVisible.value;
};

// Bei Klick auf Bestätigen das aktuelle Passwort übergeben
const submit = async () => {
  if (current_password.value) {
    // Bestätigungs-Button deaktivieren während der Verarbeitung
    isSubmitting.value = true;
    
    try {
      await emit('confirm', current_password.value);
      // Modal wird automatisch geschlossen durch den Parent
    } catch (error) {
      // Fehlerbehandlung falls nötig
      console.error('Error occured:', error);
    } finally {
      isSubmitting.value = false;
      current_password.value = '';
    }
  }
};

// Bei Klick auf Abbrechen das Modal schließen
const cancel = () => {
  current_password.value = '';
  emit('close');
};
</script>

  
<style scoped>

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
  width: 350px;
  max-width: 400px;
  padding: 2rem;
  background-color: #20252D;
  border: solid 1px #909090;
  border-radius: 20px;
  color: white;
  margin: 0 5px;
}

.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-container {
  position: relative;
  margin-bottom: 20px;
  max-width: 320px;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ccc;
}

h2 {
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 15px;
}

input.password-input {
  padding-right: 40px;  /* Platz für das Auge-Icon reservieren */
  padding-left: 4%;
  width: 100%;
  height: 35px;
  border-radius: 20px;
  border: solid 1px #FFFFFF;
  background-color: #20252D;
  position: relative;
  color: white;
}

.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;
}

button {
    border-radius: 15px;
    border: solid 1px #000000;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    width: fit-content;
}

button:hover {
    cursor: pointer;
}

.btn-confirm {
  background-color: #1c7731;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
}

.btn-cancel:hover {
    background-color: #000000;
    color: #FFFFFF;
    border: solid 1px #FFFFFF;
}

.btn-confirm:hover {
    color: #000000;
    cursor: pointer;
    background-color: #4ed329;
}

</style>