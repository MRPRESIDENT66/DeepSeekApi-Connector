// src/utils/markdownRenderer.js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import mk from '@iktakahiro/markdown-it-katex'
import 'highlight.js/styles/github.css' // 代码高亮主题
import 'katex/dist/katex.min.css'      // 数学公式样式
import multimdTable from 'markdown-it-multimd-table' // 确保这是默认导入

// 初始化 Markdown 解析器
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            const highlightedCode = hljs.highlight(str, { language: lang }).value;
            return `
                <div class="code-block-wrapper">
                    <pre class="hljs"><code>${highlightedCode}</code></pre>
                    <div class="code-footer">
                        <span class="code-lang">${lang}</span>
                        <button class="copy-btn" data-code="${encodeURIComponent(str)}">
                            <svg width="14" height="14"><path d="M10 0H2C0.9 0 0 0.9 0 2v10h2V2h8V0zm2 4H4c-1.1 0-2 0.9-2 2v10c0 1.1 0.9 2 2 2h8c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 12H4V6h8v10z"/></svg>
                            复制
                        </button>
                    </div>
                </div>
            `;
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
})

    md  .use(multimdTable, {  // 表格插件
        multiline: true,
        rowspan: true,
        headerless: true
    })
        .use(mk, {            // 数学公式插件
            delimiters: 'dollars',
            throwOnError: false, // 避免公式错误阻塞渲染
            katexOptions: {
                macros: {
                    "\\RR": "\\mathbb{R}",
                    "\\abs": ["\\left|#1\\right|", 1]
                }
            }
        });

// 安全渲染函数（需允许 KaTeX 标签）
export const renderMarkdown = (content) => {
    // let interconvert = convertMathDelimiters(content);
    return DOMPurify.sanitize(md.render(content), {
        ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'mfrac'], // 允许 KaTeX 标签
        ADD_ATTR: ['display', 'mathbackground']
    });
};


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



