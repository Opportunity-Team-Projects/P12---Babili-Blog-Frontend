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

// Kategorien und Benutzerpräferenzen abrufen
onMounted(async () => {
  try {
    const [categoriesResponse, preferencesResponse] = await Promise.all([
      CategoryService.getCategories(),
      CategoryService.getUserPreferences(),
    ]);

    categories.value = categoriesResponse.data;
    selectedCategories.value = preferencesResponse.data.categories;
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }
});

// Präferenzen speichern
const savePreferences = async () => {
  try {
    await CategoryService.saveUserPreferences({
      categories: selectedCategories.value,
    });
    console.log("Präferenzen erfolgreich gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern der Präferenzen:", error);
  }
};
</script>
