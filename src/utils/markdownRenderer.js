// src/utils/markdownRenderer.js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import mk from '@iktakahiro/markdown-it-katex'
import 'highlight.js/styles/github.css' // Code highlighting theme
import 'katex/dist/katex.min.css' // Math formula styles
import multimdTable from 'markdown-it-multimd-table' // Keep default import

// Initialize Markdown parser
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
                            Copy
                        </button>
                    </div>
                </div>
            `;
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
})

    md  .use(multimdTable, {  // Table plugin
        multiline: true,
        rowspan: true,
        headerless: true
    })
        .use(mk, {            // Math formula plugin
            delimiters: 'dollars',
            throwOnError: false, // Do not block rendering on formula errors
            katexOptions: {
                macros: {
                    "\\RR": "\\mathbb{R}",
                    "\\abs": ["\\left|#1\\right|", 1]
                }
            }
        });

// Safe renderer (allow KaTeX tags)
export const renderMarkdown = (content) => {
    // let interconvert = convertMathDelimiters(content);
    return DOMPurify.sanitize(md.render(content), {
        ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'mfrac'], // Allow KaTeX tags
        ADD_ATTR: ['display', 'mathbackground']
    });
};


// Copy support (call in component mounted hook)
export const initCopyButtons = () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) {
            const code = decodeURIComponent(e.target.dataset.code ||
                e.target.parentElement.dataset.code)
            navigator.clipboard.writeText(code).then(() => {
                const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.parentElement
                btn.innerHTML = '<svg...>✓</svg> Copied'
                setTimeout(() => {
                    btn.innerHTML = '<svg...>Copy</svg>'
                }, 2000)
            })
        }
    })
}


