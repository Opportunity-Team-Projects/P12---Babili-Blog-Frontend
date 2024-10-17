<template>
    <div>
      <button @click="openModal">Öffne Modal</button>
      
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <h2>Delete account</h2>
          <p>Warning: Deleting your account is permanent and cannot be undone.</p>
          <button @click="confirmAction">Ja</button>
          <button @click="closeModal">Nein</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'

  
  const isModalOpen = ref(false)
  
  const openModal = () => {
    isModalOpen.value = true
  }
  
  const closeModal = () => {
    isModalOpen.value = false
  }
  
  const confirmAction = () => {
    console.log('Aktion bestätigt')
    closeModal()
  }
  </script>
  
  <style scoped>

  </style>
  