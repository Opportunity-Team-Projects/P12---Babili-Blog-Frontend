
<template>
  <div class="EasyMDEContainer">
    <textarea ref="editor" :placeholder="placeholder"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits, watch } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const editor = ref(null);
let easyMDE = null;

// Props, um den Editor-Inhalt von außen zu steuern
const props = defineProps({
modelValue: String,
placeholder: {
  type: String,
  default: 'Write your blog content here...',
},
});

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newValue) => {
if (easyMDE && newValue !== easyMDE.value()) {
  easyMDE.value(newValue);
}
});

onMounted(() => {
easyMDE = new EasyMDE({
  element: editor.value,
  autofocus: true,
  spellChecker: false,
  status: false,
  placeholder: "Write your blog content here...",
  toolbar: [
    { name: "bold",
      action: EasyMDE.toggleBold,
      className: "fa fa-bold",
      title: "Bold",  /*Tooltip-Anzeige*/
    },
    {
      name: "italic",
      action: EasyMDE.toggleItalic,
      className: "fa fa-italic",
      title: "Italic",
    },
    {
      name: "heading",
      action: EasyMDE.toggleHeadingSmaller,
      className: "fa fa-header",
      title: "Heading",
    },
    "|",
    {
      name: "preview",
      action: EasyMDE.togglePreview,
      className: "fa fa-eye no-disable",
      title: "Toggle Preview",
    },
    "|",
    {
      name: "guide",
      action: "https://www.markdownguide.org/basic-syntax/",
      className: "fa fa-question-circle",
      title: "Markdown Guide",  
    },     
    
  /*"bold", "italic", "heading", "|", 
    "quote", "unordered-list", "ordered-list", "|", 
    "link", "image", "|", 
    "preview", "side-by-side", "fullscreen", "|", 
    "guide"
    */
  ]
});

// Initialisiere den Editor mit dem Wert von v-model
easyMDE.value(props.modelValue || '');

// Reagiere auf Änderungen im Editor und aktualisiere v-model
easyMDE.codemirror.on("change", () => {
  emit('update:modelValue', easyMDE.value());
});
});

onBeforeUnmount(() => {
if (easyMDE) {
  easyMDE.toTextArea();
  easyMDE = null;
}
});
</script>

<style>
.EasyMDEContainer {
background-color: #20262d;
}

.EasyMDEContainer .CodeMirror {
color: white;
background-color: #20262d;
border-radius: 14px;
border: 1px solid #909090 !important;
border-bottom-left-radius: 14px !important;
border-bottom-right-radius: 14px !important;
border-top-right-radius: 0;
border-top-left-radius: 0;
}

.editor-toolbar {
display: flex;
justify-content: space-between;
align-items: center;
background-color: #20262d;
border: 1px solid #909090 !important;
border-bottom: 2px solid #CE3DF3 !important;
border-top-left-radius: 14px !important;
border-top-right-radius: 14px !important;
border-bottom-right-radius: 0;
border-bottom-left-radius: 0;
padding: 5px 10px;
}

/* Vergrößerter Guide-Button */
.editor-toolbar button.guide {
display: flex;
justify-content: center;
align-items: center;
margin: 0 20px;
padding: 8px 30px;
}

/* Vergrößerter Preview-Button */
.editor-toolbar button.preview {
display: flex;
order: 0;   /* Mitte */
flex-grow: 1;    /* Füllt den verfügbaren Platz in der Mitte */
justify-content: center;
align-items: center;
max-width: none; 
margin: 0 100px;
padding: 8px 20px;
font-size: 16px;
border: 1px solid #909090;
border-radius: 4px;
background-color: #2C3E50;
}

.editor-toolbar button {
color: white !important;
font-weight: bold;
margin: 0 5px;
flex-shrink: 0;
}

.editor-toolbar button:hover,
.editor-toolbar button.active {
background-color: #3E5060;
}

.editor-preview {
background-color: #20262D;
color: white;
}

.CodeMirror-cursor {
border-left: 1px solid white;
animation: blink 1s step-end infinite;
}

@keyframes blink {
50% {
  border-color: transparent;
}
}
</style>

