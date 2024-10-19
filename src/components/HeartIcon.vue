<script setup>
import { ref } from "vue";
import PostService from "@/services/PostService";

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
  initiallyLiked: {
    type: Boolean,
    default: false,
  },
  isOwnPost: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update-like"]);

const isLiked = ref(props.initiallyLiked);

const toggleLike = async () => {
  try {
    let response;
    if (isLiked.value) {
      response = await PostService.unlikePost(props.postId);
    } else {
      response = await PostService.likePost(props.postId);
    }
    isLiked.value = response.is_liked;
    emits("update-like", response.likes_count, response.is_liked);
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
</script>

<template>
  <button
    type="button"
    class="action-icon-button"
    :class="{ liked: isLiked }"
    @click="toggleLike"
    :disabled="isOwnPost"
    aria-label="Like Post"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      class="heart-icon"
    >
      <path
        d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
      ></path>
    </svg>
  </button>
</template>

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

.action-icon-button.liked {
  color: rgb(183, 0, 255);
}

.action-icon-button:hover {
  transform: scale(1.1);
}

/* Optional: Style für das SVG-Icon */
.heart-icon {
  width: 1em;
  height: 1em;
}
</style>
