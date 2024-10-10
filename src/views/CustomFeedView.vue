<template>
  <div>
    <h2>Wähle deine bevorzugten Kategorien</h2>
    <div v-for="category in categories" :key="category.id">
      <input
        type="checkbox"
        :value="category.id"
        v-model="selectedCategories"
      />
      <label>{{ category.categoryName }}</label>
    </div>
    <button @click="savePreferences">Speichern</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CategoryService from "@/services/CategoryService";

const categories = ref([]);
const selectedCategories = ref([]);

// Kategorien abrufen
onMounted(async () => {
  try {
    const response = await CategoryService.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
  }
});

const savePreferences = () => {
  console.log("Ausgewählte Kategorien:", selectedCategories.value);
};

onMounted(async () => {
  try {
    const response = await CategoryService.getCategories();
    console.log("Kategorien vom Backend:", response.data); // Überprüfen
    categories.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
  }
});
</script>
