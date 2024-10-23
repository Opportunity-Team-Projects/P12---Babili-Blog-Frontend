<template>
  <div class="custom-feed-overlay">
    <div class="custom-feed-container">
      <h1>Custom Feed Settings</h1>
      <div class="purple-line"></div>
      <div class="tags-container">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="toggleCategory(category.id)"
          :class="{ selected: selectedCategories.includes(category.id) }"
        >
          <i
            :class="
              selectedCategories.includes(category.id)
                ? 'fas fa-times'
                : 'fas fa-plus'
            "
          ></i>
          {{ category.categoryName }}
        </button>
      </div>
      <div class="action-buttons">
        <button class="cancel-btn" @click="cancel">Cancel</button>
        <button class="save-btn" @click="savePreferences">
          Save Preferences
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CategoryService from "@/services/CategoryService";

const categories = ref([]);
const selectedCategories = ref([]);
const emit = defineEmits(["close", "save"]);

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

const toggleCategory = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

const savePreferences = async () => {
  try {
    await CategoryService.saveUserPreferences({
      categories: selectedCategories.value,
    });
    console.log("Präferenzen erfolgreich gespeichert");
    emit("save", selectedCategories.value);
  } catch (error) {
    console.error("Fehler beim Speichern der Präferenzen:", error);
  }
};

const cancel = () => {
  emit("close");
};
</script>

<style scoped>
.custom-feed-overlay {
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

.custom-feed-container {
  width: 680px;
  background-color: #1c1f26;
  border-radius: 8px;
  border: 1px solid #909090;
  padding: 20px;
  color: white;
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.tags-container button {
  font-weight: 500;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #ce3df3;
  color: #ce3df3;
  padding: 5px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tags-container button.selected {
  background-color: #ce3df3;
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
}

.cancel-btn {
  background-color: white;
  color: black;
}

.save-btn {
  background-color: #ce3df3;
  color: white;
}

@media screen and (max-width: 768px) {
  .custom-feed-container {
    width: 90%;
  }
}
</style>
