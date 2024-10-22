<template>
  <div class="filter-component">
    <button
      @click="setFilter('recent')"
      :class="{ active: currentFilter === 'recent' }"
    >
      Most Recent
    </button>
    <button
      @click="setFilter('popular')"
      :class="{ active: currentFilter === 'popular' }"
    >
      Popular
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const currentFilter = ref("recent");
const emit = defineEmits(["filter-change"]);

const setFilter = (filter) => {
  currentFilter.value = filter;
  emit("filter-change", filter);
};
</script>

<style scoped>
.filter-component {
  display: flex;
  gap: 10px;
}

.filter-component button {
  padding: 10px 15px;
  font-size: 0.9em;
  color: white;
  background-color: rgba(206, 61, 243, 0.2);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.filter-component button:hover {
  background-color: rgba(206, 61, 243, 0.4);
}

.filter-component button.active {
  background-color: #ce3df3;
}
</style>
