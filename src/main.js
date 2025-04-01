import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/markdown.css'
// 数学公式样式
import 'katex/dist/katex.min.css';
// 代码高亮样式
import 'highlight.js/styles/github.css';

createApp(App).mount('#app')
