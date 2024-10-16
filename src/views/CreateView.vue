<template>
  <HeaderMain />

  <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />

  <div
    v-if="!isSidebarCollapsed"
    class="overlay"
    @click="handleToggle(true)"
  ></div>

  <div class="main-content">
    <div class="create-post-container">
      <h1>Create Post</h1>
      <div class="purple-line"></div>

      <div class="image-and-tags">
        <div class="image-upload" @click="triggerFileInput">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
          />
          <i class="fas fa-image"></i>
          <span>Click to upload image</span>
        </div>
        <div class="tags-container">
          <button
            v-for="tag in tags"
            :key="tag.id"
            @click="toggleTag(tag)"
            :class="{ selected: selectedTags.includes(tag.id) }"
          >
            <i
              :class="
                selectedTags.includes(tag.id) ? 'fas fa-times' : 'fas fa-plus'
              "
            ></i>
            {{ tag.name }}
          </button>

          <div class="form-group">
            <input
              v-model="post.contentTitle"
              type="text"
              id="postTitle"
              required
              placeholder="Post Title"
            />
          </div>

          <div class="content-area">
            <EasyMDEEditor v-model="post.content" />
          </div>

          <div class="action-buttons">
            <button class="cancel-btn" @click="cancelPost">Cancel</button>
            <button class="post-btn" @click="createPost">Post</button>
          </div>
        </div>

        <div class="form-group">
          <input
            v-model="post.contentTitle"
            type="text"
            id="postTitle"
            required
            placeholder="Post Title"
          />
        </div>

        <div class="content-tabs">
          <button
            :class="{ active: activeTab === 'write' }"
            @click="activeTab = 'write'"
          >
            Write
          </button>
          <button
            :class="{ active: activeTab === 'preview' }"
            @click="activeTab = 'preview'"
          >
            Preview
          </button>
        </div>

        <div class="content-area">
          <textarea
            v-if="activeTab === 'write'"
            v-model="post.content"
            placeholder="Write your blog content here..."
          ></textarea>
          <div v-else class="preview-content">
            <!-- Add preview logic here -->
            Preview content placeholder
          </div>
        </div>

        <div class="action-buttons">
          <button class="cancel-btn" @click="cancelPost">Cancel</button>
          <button class="post-btn" @click="createPost">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/services/AuthService";
import HeaderMain from "@/components/HeaderMain.vue";
import Sidebar from "@/components/Sidebar.vue";
import EasyMDEEditor from "@/components/EasyMDEEditor.vue";

const router = useRouter();
const fileInput = ref(null);

const post = ref({
  contentTitle: "",
  content: "",
  contentImg: "",
  category_ids: [],
});

const tags = ref([
  { id: 1, name: "Technology" },
  { id: 2, name: "Gaming" },
  { id: 3, name: "Hardware" },
  { id: 4, name: "Software" },
  { id: 5, name: "Cybersecurity" },
  { id: 6, name: "Innovations" },
  { id: 7, name: "Education" },
]);

const selectedTags = ref([]);
const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag.id);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag.id);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  // Handle file upload logic here
  console.log("File selected:", file.name);
};

const createPost = async () => {
  try {
    if (selectedTags.value.length > 0) {
      post.value.category_ids = selectedTags.value;
    }

    const response = await authClient.post("/api/posts", post.value);
    console.log("Post creation response:", response.data);

    router.push("/"); // Nach dem Erstellen zur Home-Seite navigieren
  } catch (error) {
    if (error.response) {
      alert(`Failed to create post: ${error.response.data.message}`);
    }
  }
};

const cancelPost = () => {
  router.push("/");
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
  /* background: radial-gradient(#62a0ea 0%, #1c71d8 28%, #1a5fb4 46%, #241f31 75%);*/
  color: white;
  display: flex;
  justify-content: center;
  padding-top: 43px;
  min-height: 100vh;
}

.create-post-container {
  width: 680px;
  height: min-content;
  background-color: #1c1f26;
  border-radius: 8px;
  border: 1px solid #909090;
  padding: 10px;
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

.image-and-tags {
  flex-direction: column;
}

.image-upload {
  width: 100%;
  margin-bottom: 20px;
}

.tags-container {
  padding-left: 0;
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  height: 36px;
  padding: 10px;
  border: 1px solid #909090;
  border-radius: 14px;
  background-color: #20262d;
  color: white;
}

.content-area {
  flex-grow: 1;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.cancel-btn,
.post-btn {
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

.post-btn {
  background-color: #ce3df3;
  color: white;
}

@media screen and (max-width: 768px) {
  .create-post-container {
    width: 100%;
    height: auto;
    min-height: 100vh;
  }

  .image-and-tags {
    flex-direction: column;
  }

  .image-upload {
    width: 100%;
    margin-bottom: 20px;
  }

  .tags-container {
    padding-left: 0;
  }
}
</style>
