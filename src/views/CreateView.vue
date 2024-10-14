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
              :class="{ selected: selectedTags.includes(tag.id) }"
            >
              <i :class="selectedTags.includes(tag.id) ? 'fas fa-times' : 'fas fa-plus'"></i>
              {{ tag.name }}
            </button>
          </div>
        </div>
  
        <div class="form-group">
          <input v-model="post.contentTitle" type="text" id="postTitle" required placeholder="Post Title">
        </div>
  
        <div class="content-area">
           <textarea ref="editor"></textarea>
        </div>
  
        <div class="action-buttons">
          <button class="cancel-btn" @click="cancelPost">Cancel</button>
          <button class="post-btn" @click="createPost">Post</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import EasyMDE from 'easymde';
  import 'easymde/dist/easymde.min.css';
  import { useRouter } from 'vue-router';
  import { authClient } from '@/services/AuthService';
  import HeaderMain from '@/components/HeaderMain.vue';
  import Sidebar from '@/components/Sidebar.vue';
  
  const router = useRouter();
  const fileInput = ref(null);
  const activeTab = ref('write');

  const editor = ref(null);
  let easyMDE = null;
  
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
    console.log('File selected:', file.name);
  };
  
  const createPost = async () => {
  try {
    if (selectedTags.value.length > 0) {
      post.value.category_ids = selectedTags.value;
    } 

    const response = await authClient.post('/api/posts', post.value);
    console.log('Post creation response:', response.data);

    router.push('/'); // Nach dem Erstellen zur Home-Seite navigieren
  } catch (error) {
    if (error.response) {

      alert(`Failed to create post: ${error.response.data.message}`);
  
    }
  }
};
  
  const cancelPost = () => {
    router.push('/'); 
  };
  
onMounted(() => {
  easyMDE = new EasyMDE({
    element: editor.value,
    autofocus: true,
    spellChecker: false,
    status: false,
    placeholder: "Write your blog content here...",
    toolbar: [
      "link", 
      {
        name: "preview",
        action: EasyMDE.togglePreview,
        className: "fa fa-eye no-disable",
        title: "Vorschau",
      },
      
      "guide",
      
/*    "bold", "italic", "heading", "|", 
      "quote", "unordered-list", "ordered-list", "|", 
      "link", "image", "|", 
      "preview", "side-by-side", "fullscreen", "|", 
      "guide"
      */
    ]
});

easyMDE.value(post.value.content);

easyMDE.codemirror.on("change", () => {
  post.value.content = easyMDE.value();
});
});

onBeforeUnmount(() => {
  if (easyMDE) {
    easyMDE.toTextArea();
    easyMDE = null;
  }
});



</script>
  
<style scoped>

  .main-content {
    z-index: 1; 
    width: 100%;
    transition: all 0.3s ease;
    padding: 20px; 
    background-color: #0E1217;
    background: radial-gradient(#62a0ea 0%, #1c71d8 28%, #1a5fb4 46%, #241f31 75%);    color: white;
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

<!-- zusätzliches style-Tag ohne scoped für die EasyMDE-Styles -->

<style>
.EasyMDEContainer {
  background-color: #20262d;
}

.EasyMDEContainer .CodeMirror {
  color: white;
  background-color: #20262d;
  border-radius: 14px;
  border: 1px solid #909090 !important;
  /* Nur die unteren Ecken abrunden */
  border-bottom-left-radius: 14px !important;
  border-bottom-right-radius: 14px !important;
  /* Die oberen Ecken ohne Radius belassen */
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.editor-toolbar {
  background-color: #20262d;
  border: 1px solid #909090 !important;
  border-bottom: 2px solid #CE3DF3 !important;
  /* Nur die oberen Ecken abrunden */
  border-top-left-radius: 14px !important;
  border-top-right-radius: 14px !important;
  /* Die unteren Ecken ohne Radius belassen */
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.editor-toolbar button {
  color: white !important;
  font-weight: bold;
  margin-right: 5px;
}

.editor-toolbar button:hover,
.editor-toolbar button.active {
  background-color: #2C3E50;
}

.editor-preview {
  background-color: #20262D;
  color: white;
}

/* Sichtbarer blinkender Cursor */
.CodeMirror-cursor {
  border-left: 1px solid white;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.editor-toolbar button::before {
  font-family: "Roboto Slab", serif;
}

/* Anpassung der Toolbar-Symbole */
.editor-toolbar button[title="Vorschau"]::before { content: "Preview"; }

/* Guide-Button ganz rechts */
.editor-toolbar button[title="Guide"] {
  margin-left: auto;
}

/* Trennlinien in der Toolbar */
.editor-toolbar .separator {
  margin: 0 10px;
}

/* Zusätzliche Stile für bessere Sichtbarkeit */
.CodeMirror-selected {
  background-color: rgba(206, 61, 243, 0.3);
}

.cm-header {
  color: #CE3DF3;
}

.cm-link {
  color: #4A90E2;
}

</style>
