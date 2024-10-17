<template>
  <HeaderMain />

  <Sidebar :collapsed="isSidebarCollapsed" @toggle="handleToggle" />

  <div v-if="!isSidebarCollapsed" class="overlay" @click="handleToggle(true)"></div>

  <div class="main-content">
    <div class="create-post-container">
      <h1>Create Post</h1>
      <div class="purple-line"></div>

      <div class="image-and-tags">
        <div class="image-upload" @click="triggerFileInput">
          <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload">
          <i class="fas fa-image"></i>
          <span>Click to upload image</span>
        </div>
        <div class="tags-container">
          <button 
            v-for="tag in tags" 
            :key="tag.id" 
            @click="toggleTag(tag)"
            :class="{ selected: post.category_ids.includes(tag.id) }"
          >
            <i :class="post.category_ids.includes(tag.id) ? 'fas fa-times' : 'fas fa-plus'"></i>
            {{ tag.name }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <div class="title-input-container">
          <input 
            v-model="post.contentTitle" 
            type="text" 
            id="postTitle" 
            required 
            placeholder="Post Title"
            @input="limitTitleLength"
            :maxlength="maxTitleLength"
          >
          <span class="character-count" :class="{ 'error': remainingChars === 0 }">
            {{ remainingChars }}
          </span>
        </div>
        <p v-if="remainingChars === 0" class="error-message">
          Maximum character limit reached
        </p>
      </div>

      <div class="content-area">
        <EasyMDEEditor v-model="post.content" />
      </div>

      <div class="action-buttons">
        <button class="cancel-btn" @click="cancelPost">Cancel</button>
        <button class="post-btn" @click="createPost" :disabled="isSubmitting">
          {{ isSubmitting ? 'Posting...' : 'Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '@/services/AuthService';
import HeaderMain from '@/components/HeaderMain.vue';
import Sidebar from '@/components/Sidebar.vue';
import EasyMDEEditor from '@/components/EasyMDEEditor.vue';

const router = useRouter();
const fileInput = ref(null);
const isSubmitting = ref(false);

const maxTitleLength = 100;

const remainingChars = computed(() => {
  return maxTitleLength - (post.value.contentTitle?.length || 0);
});

const limitTitleLength = () => {
  if (post.value.contentTitle.length > maxTitleLength) {
    post.value.contentTitle = post.value.contentTitle.slice(0, maxTitleLength);
  }
};

const post = ref({
  contentTitle: '',
  content: '',
  contentImg: '',
  category_ids: []
});

const tags = ref([
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Gaming' },
  { id: 3, name: 'Hardware' },
  { id: 4, name: 'Software' },
  { id: 5, name: 'Cybersecurity' },
  { id: 6, name: 'Innovations' },
  { id: 7, name: 'Education' },
]);

const isSidebarCollapsed = ref(true);

const handleToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const toggleTag = (tag) => {
  const index = post.value.category_ids.indexOf(tag.id);
  if (index > -1) {
    post.value.category_ids.splice(index, 1);
  } else {
    post.value.category_ids.push(tag.id);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      post.value.contentImg = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const validatePost = () => {
  if (!post.value.contentTitle.trim()) {
    alert('Please enter a post title');
    return false;
  }
  if (!post.value.content.trim()) {
    alert('Please enter some content for your post');
    return false;
  }
  if (post.value.category_ids.length === 0) {
    alert('Please select at least one category');
    return false;
  }
  return true;
};

const createPost = async () => {
  if (!validatePost()) return;

  isSubmitting.value = true;
  try {
    const response = await authClient.post('/api/posts', post.value);
    console.log('Post creation response:', response.data);
    
    router.push('/');
  } catch (error) {
    console.error('Error creating post:', error);
    if (error.response) {
      alert(`Failed to create post: ${error.response.data.message}`);
    } else {
      alert('An error occurred while creating the post. Please try again.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const cancelPost = () => {
  if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
    router.push('/');
  }
};
</script>
  
<style scoped>

  .main-content {
    z-index: 1; 
    width: 100%;
    transition: all 0.3s ease;
    padding: 20px; 
    background: radial-gradient(#3584e4 0%, #1a5fb4 15%, #1c71d8 34%, #241f31 62%, #000000 92%);
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
    background-color: #1C1F26;
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
    background-color: #CE3DF3;
    margin-bottom: 20px;
  }
  
  .image-and-tags {
    display: flex;
    margin-bottom: 20px;
  }
  
  .image-upload {
    width: 278px;
    height: 170px;
    border-radius: 25px;
    border-style: solid;
    border-color: #909090;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .tags-container {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-left: 20px;
    width: 103px;
    height: 39px;
  }
  
  .tags-container button {
    font-weight: 500;
    font-size: 16px;
    background-color: transparent;
    border: 1px solid #CE3DF3;
    color: #CE3DF3;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .tags-container button.selected {
    background-color: #CE3DF3;
    color: white;
  }
  
  .form-group {
    position: relative;
    margin-bottom: 20px;
  }

  .title-input-container {
  display: flex;
  align-items: center;
}

.title-input-container input {
  flex-grow: 1;
  padding-right: 40px; /* Make space for the character count */
}

.character-count {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #909090;
}

.character-count.error {
  color: #ff4d4d;
}

.error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 5px;
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
    background-color: #20262D;
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
  
  .cancel-btn, .post-btn {
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
    background-color: #CE3DF3;
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
