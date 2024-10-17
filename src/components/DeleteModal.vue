<template>
    <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay">
            <div class="modal">
                <div class="modal-content">
                    <h2>Delete account</h2>
                    <p>Warning: Deleting your account is permanent and cannot be undone.</p>
                    <div class="btns">
                        <button @click="closeModal" class="btn-cancel">Cancel</button>
                        <button @click="confirmAction" class="btn-del">Delete account</button>
                    </div>  
                </div>
            </div>
        </div>
    </Transition>
</template>
  
  <script setup>
  import { ref, defineEmits } from 'vue'

  const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

  const emit = defineEmits(['update:modelValue', 'confirm']) // Event-Emitter für Schließen und Bestätigung
  
  const closeModal = () => {
    emit('update:modelValue', false) // Emit event to update parent's v-model
}
  
  const confirmAction = () => {
    emit('confirm') // Sendet die Bestätigung des Löschens
    closeModal() // Modal schließen
  }
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
    min-width: 320px;
    max-width: 400px;
    padding: 2rem;
    background-color: #20252D;
    border: solid 1px #909090;
    border-radius: 20px;
    color: white;
}

.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

h2 {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
}

p {
    color: #ff6b6b;
    text-align: center;
}

.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

button {
    border-radius: 15px;
    border: solid 1px #000000;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    width: fit-content;
}

button:hover {
    cursor: pointer;
}

.btn-del {
    background-color: #a80f33;
    color: white;
}

.btn-cancel:hover {
    background-color: #000000;
    color: #FFFFFF;
    border: solid 1px #FFFFFF;
}

.btn-del:hover {
    color: #000000;
    cursor: pointer;
    background-color: #D91544;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
}

.modal-enter-to {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.modal-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.modal-leave-to {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
}
</style>
  