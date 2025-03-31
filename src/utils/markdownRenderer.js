// src/utils/markdownRenderer.js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import mk from '@iktakahiro/markdown-it-katex'
import 'highlight.js/styles/github.css' // 代码高亮主题
import 'katex/dist/katex.min.css'      // 数学公式样式

// 初始化 Markdown 解析器
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
                const highlightedCode = hljs.highlight(str, { language: lang }).value
                return `
        <div class="code-block-wrapper">
          <pre class="hljs"><code>${highlightedCode}</code></pre>
          <div class="code-footer">
            <span class="code-lang">${lang}</span>
            <button class="copy-btn" data-code="${encodeURIComponent(str)}">
              <svg width="14" height="14"><!-- 图标路径 --></svg>
              复制
            </button>
          </div>
        </div>
      `
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})

// 添加数学公式支持
md.use(mk, {
    delimiters: 'dollars', // 使用 $...$ 作为公式分隔符
    katexOptions: {        // KaTeX 配置
        macros: {
            "\\RR": "\\mathbb{R}",
            "\\abs": ["\\left|#1\\right|", 1]
        }
    }
})

// 安全渲染函数
export const renderMarkdown = (content) => {
    return DOMPurify.sanitize(md.render(content))
}

// 复制功能 (需在组件 mounted 时调用)
export const initCopyButtons = () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) {
            const code = decodeURIComponent(e.target.dataset.code ||
                e.target.parentElement.dataset.code)
            navigator.clipboard.writeText(code).then(() => {
                const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.parentElement
                btn.innerHTML = '<svg...>✓</svg> 已复制'
                setTimeout(() => {
                    btn.innerHTML = '<svg...>复制</svg>'
                }, 2000)
            })
        }
    })
}