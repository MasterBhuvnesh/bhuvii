/**
 * Renders ```mermaid code blocks to inline SVG at build time via Kroki,
 * so diagram pages ship zero Mermaid JS and make zero runtime requests.
 * If Kroki is unreachable (offline build), the code block is left as-is.
 * No dependencies — plain hast tree walking (hast v3 shape).
 */

const cache = new Map();

async function renderSvg(source) {
    let svg = cache.get(source);
    if (!svg) {
        const res = await fetch('https://kroki.io/mermaid/svg', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: source
        });
        if (!res.ok) throw new Error(`kroki ${res.status}`);
        svg = await res.text();
        if (!svg.includes('<svg')) throw new Error('kroki: no svg');
        cache.set(source, svg);
    }
    return svg;
}

function textOf(node) {
    if (node.type === 'text') return node.value;
    if (Array.isArray(node.children)) return node.children.map(textOf).join('');
    return '';
}

function decodeEntities(s) {
    return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (m, e) => {
        if (e[0] === '#') {
            const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
            try {
                return String.fromCodePoint(n);
            } catch {
                return m;
            }
        }
        return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[e] ?? m;
    });
}

function visit(node, parent, index) {
    if (node && typeof node === 'object') {
        if (node.type === 'raw' && typeof node.value === 'string' && node.value.includes('data-language="mermaid"')) {
            // Astro/Shiki pre-highlights fences into raw HTML before rehype plugins run.
            const m = node.value.match(/<code[^>]*>([\s\S]*?)<\/code>/);
            if (m) {
                jobs.push({ parent, index, text: decodeEntities(m[1].replace(/<[^>]+>/g, '')) });
            }
        }
        if (node.type === 'element' && node.tagName === 'pre' && Array.isArray(node.children)) {
            const code = node.children.find((c) => c.type === 'element' && c.tagName === 'code');
            const classes = code?.properties?.className;
            const codeLang = Array.isArray(classes)
                ? classes.map(String).find((c) => c.startsWith('language-'))?.slice(9)
                : null;
            // Astro/Shiki emits <pre data-language="mermaid"> without a code class.
            const preLang = node.properties?.dataLanguage;
            if (code && (codeLang === 'mermaid' || preLang === 'mermaid')) {
                jobs.push({ parent, index, text: textOf(code) });
            }
        }
        if (Array.isArray(node.children)) {
            node.children.forEach((child, i) => visit(child, node, i));
        }
    }
}

// Collected per-run (plugin factory invoked once, transformer per document).
let jobs = [];

export default function rehypeMermaidKroki() {
    return async (tree) => {
        jobs = [];
        visit(tree, null, -1);
        for (const job of jobs) {
            if (!job.parent || job.index < 0) continue;
            try {
                const svg = await renderSvg(job.text);
                job.parent.children[job.index] = {
                    type: 'raw',
                    value: `<span class="mm">${svg}</span>`
                };
            } catch {
                // Offline or Kroki down: keep the readable code block.
            }
        }
    };
}
