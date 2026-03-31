import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/markdown.css'
// Math formula styles
import 'katex/dist/katex.min.css';
// Code highlighting styles
import 'highlight.js/styles/github.css';

createApp(App).mount('#app')
