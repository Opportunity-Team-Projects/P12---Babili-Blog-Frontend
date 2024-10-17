<template>
  <HeaderMain />

  <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />

  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <div class="main-content">
    <div class="contact-container">
      <h1>Contact</h1>
      <div class="purple-line"></div>

      <div class="form-group">
        <label for="name">Name</label>
        <input v-model="contact.name" type="text" id="name" required />
      </div>

      <div class="form-group">
        <label for="email">E-Mail</label>
        <input v-model="contact.email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          v-model="contact.message"
          id="message"
          rows="6"
          required
        ></textarea>
      </div>

      <div class="form-group checkbox-group">
        <input
          v-model="contact.agreeToTerms"
          type="checkbox"
          id="terms"
          required
        />
        <label for="terms">I agree to the terms of use</label>
      </div>

      <button
        class="send-btn"
        @click="sendMessage"
        :disabled="!isFormValid || isSending"
      >
        {{ isSending ? "Sending..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";
/* import ContactService from "@/services/ContactService"; */

const isSidebarCollapsed = ref(true);
const isSending = ref(false);

const contact = ref({
  name: "",
  email: "",
  message: "",
  agreeToTerms: false,
});

const isFormValid = computed(() => {
  return (
    contact.value.name.trim() !== "" &&
    contact.value.email.trim() !== "" &&
    contact.value.message.trim() !== "" &&
    contact.value.agreeToTerms
  );
});

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const sendMessage = async () => {
  if (!isFormValid.value) return;

  isSending.value = true;
  try {
    await ContactService.sendMessage(contact.value);
    alert("Message sent successfully!");
    // Reset form
    contact.value = { name: "", email: "", message: "", agreeToTerms: false };
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  } finally {
    isSending.value = false;
  }
};
</script>

<style scoped>
.main-content {
  z-index: 1;
  width: 100%;
  transition: all 0.3s ease;
  padding: 20px;
  background: radial-gradient(
    #3584e4 0%,
    #1a5fb4 15%,
    #1c71d8 34%,
    #241f31 62%,
    #000000 92%
  );
  color: white;
  display: flex;
  justify-content: center;
  padding-top: 43px;
  min-height: 100vh;
}

.contact-container {
  width: 680px;
  height: 600px;
  background-color: #1c1f26;
  border-radius: 8px;
  border: 1px solid #909090;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.purple-line {
  height: 2px;
  background-color: #ce3df3;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #909090;
  border-radius: 14px;
  background-color: #20262d;
  color: white;
}

textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  margin-right: 10px;
}

.send-btn {
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  background-color: #000000;
  color: white;
  align-self: flex-end;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
  .contact-container {
    width: 100%;
  }
}
</style>
