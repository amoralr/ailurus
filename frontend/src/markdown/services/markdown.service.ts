import { marked } from 'marked';
import { codeToHtml } from 'shiki';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

class MarkdownService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    // Configure marked
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
    });

    // Setup custom renderer
    const renderer = new marked.Renderer();

    // Headings with anchor links
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const id = this.slugify(text);
      return `
        <h${depth} id="${id}">
          <a href="#${id}" class="heading-anchor" aria-label="Anchor to ${text}">
            <span class="anchor-icon">#</span>
          </a>
          ${text}
        </h${depth}>
      `;
    };

    // Code blocks with syntax highlighting and Mermaid support
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
      // Detectar bloques Mermaid
      if (lang === 'mermaid') {
        return `<div class="mermaid-container"><pre class="mermaid">${text}</pre></div>`;
      }
      return `<pre><code class="language-${lang || 'text'}" data-code="${this.encodeCode(text)}" data-lang="${lang || 'text'}">${this.escapeHtml(text)}</code></pre>`;
    };

    // Links (open external links in new tab)
    renderer.link = ({ href, title, tokens }: { href: string; title?: string | null; tokens: any }) => {
      const text = tokens.map((t: any) => t.raw || t.text).join('');
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
    };

    // Images with lazy loading and caption support
    renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
      const alt = this.escapeHtml(text || 'Image');
      const titleAttr = title ? ` title="${this.escapeHtml(title)}"` : '';
      const caption = title || text;
      
      return `
        <figure class="markdown-image-container">
          <img 
            src="${href}" 
            alt="${alt}"${titleAttr}
            loading="lazy"
            class="markdown-image"
            data-zoomable
          />
          ${caption ? `<figcaption class="markdown-image-caption">${this.escapeHtml(caption)}</figcaption>` : ''}
        </figure>
      `;
    };

    marked.use({ renderer });
    this.initialized = true;
  }

  async render(content: string): Promise<string> {
    await this.initialize();
    return marked.parse(content) as string;
  }

  extractHeadings(content: string): Heading[] {
    const headings: Heading[] = [];
    const tokens = marked.lexer(content);

    tokens.forEach((token) => {
      if (token.type === 'heading') {
        const text = token.text;
        const id = this.slugify(text);
        headings.push({
          id,
          text,
          level: token.depth,
        });
      }
    });

    return headings;
  }

  async highlightCode(code: string, lang: string): Promise<string> {
    try {
      const html = await codeToHtml(code, {
        lang: lang || 'text',
        theme: 'github-dark',
      });
      return html;
    } catch (error) {
      console.error('Error highlighting code:', error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private encodeCode(code: string): string {
    return encodeURIComponent(code);
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

export const markdownService = new MarkdownService();
