<template>

      <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <h2>Delete account</h2>
                <p>Warning: Deleting your account is permanent and cannot be undone.</p>
                <div class="btns">
                    
                    <button @click="closeModal" class="btn-cancel">Cancel</button>
                    <button @click="confirmAction" class="btn-del"->Delete account</button>

                </div>  
            </div>
      </div>

  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue'

  
  const isModalOpen = ref(true); // Modal geöffnet
  const emit = defineEmits(['close', 'confirm']) // Event-Emitter für Schließen und Bestätigung
  
  const closeModal = () => {
  emit('close'); // Schließt das Modal
};
  
  const confirmAction = () => {
    emit('confirm') // Sendet die Bestätigung des Löschens
    closeModal() // Modal schließen
  }
  </script>
  
  <style scoped>

.modal {
    max-width: 450px;
    height: 300px;
    background-color: #20252D;
    border: solid 1px #909090;
    border-radius: 20px;
    color: white;
}

.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

button {
    border-radius: 15px;
    border: solid 1px #000000;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    width: fit-content;
}

button:hover {
    cursor: pointer;
}



  </style>
  