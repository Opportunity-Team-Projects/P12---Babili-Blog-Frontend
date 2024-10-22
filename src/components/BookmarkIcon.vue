<template>
  <button
    type="button"
    class="action-icon-button"
    :class="{ bookmarked: isBookmarked }"
    @click="toggleBookmark"
    aria-label="Bookmark Post"
  >
    <svg
      v-if="!isBookmarked"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      class="bookmark-icon"
    >
      <!-- Unbookmarked Icon -->
      <path
        d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48z"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      class="bookmark-icon"
    >
      <!-- Bookmarked Icon -->
      <path
        d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464l-192-112L0 512z"
      />
    </svg>
  </button>
</template>

<script setup>
import { ref } from "vue";
import PostService from "@/services/PostService";

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
  initiallyBookmarked: {
    type: Boolean,
    default: false,
  },
  isOwnPost: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update-bookmark"]);

const isBookmarked = ref(props.initiallyBookmarked);

const toggleBookmark = async () => {
  try {
    if (isBookmarked.value) {
      await PostService.unbookmarkPost(props.postId);
    } else {
      await PostService.bookmarkPost(props.postId);
    }
    isBookmarked.value = !isBookmarked.value;
    emits("update-bookmark", isBookmarked.value);
  } catch (error) {
    console.error("Error toggling bookmark:", error);
  }
};
</script>

<style scoped>
.action-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.6em;
  color: white;
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 2px;
}

.action-icon-button.bookmarked {
  color: rgb(183, 0, 255); /* Goldfarbe für gebookmarkte Posts */
}

.action-icon-button:hover {
  transform: scale(1.1);
}

.bookmark-icon {
  width: 1em;
  height: 1em;
}
</style>
