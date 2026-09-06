import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  text: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    containerRef.current.innerHTML = '';

    // Helper to auto-balance unclosed markdown tags before inline rendering
    const normalizeInlineMarkdown = (s: string) => {
      // If odd number of ** exist, close the dangling ** at colon or end
      const boldCount = (s.match(/\*\*/g) || []).length;
      if (boldCount % 2 !== 0) {
        if (/(\*\*[^\*:]+:)/.test(s)) {
          s = s.replace(/(\*\*[^\*:]+:)/, '$1**');
        }
        if ((s.match(/\*\*/g) || []).length % 2 !== 0) {
          s += '**';
        }
      }
      return s;
    };

    // Helper to render inline formatting: KaTeX, inline code, bold, italic
    const renderInline = (rawStr: string, parent: HTMLElement) => {
      const str = normalizeInlineMarkdown(rawStr);

      // 1. Split by Block Math ($$...$$) and Inline Math ($...$)
      const mathParts = str.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      mathParts.forEach(mPart => {
        if (mPart.startsWith('$$') && mPart.endsWith('$$') && mPart.length > 4) {
          const math = mPart.slice(2, -2);
          const div = document.createElement('div');
          div.className = 'katex-block-wrapper my-2';
          try {
            katex.render(math, div, { displayMode: true, throwOnError: false });
          } catch {
            div.textContent = mPart;
          }
          parent.appendChild(div);
        } else if (mPart.startsWith('$') && mPart.endsWith('$') && mPart.length > 2) {
          const math = mPart.slice(1, -1);
          const span = document.createElement('span');
          span.className = 'katex-inline-wrapper';
          try {
            katex.render(math, span, { displayMode: false, throwOnError: false });
          } catch {
            span.textContent = mPart;
          }
          parent.appendChild(span);
        } else {
          // 2. Split by inline code (`code`)
          const codeParts = mPart.split(/(`[^`]+`)/g);
          codeParts.forEach(cPart => {
            if (cPart.startsWith('`') && cPart.endsWith('`') && cPart.length >= 2) {
              const codeEl = document.createElement('code');
              codeEl.className = 'inline-code-pill';
              codeEl.textContent = cPart.slice(1, -1);
              parent.appendChild(codeEl);
            } else {
              // 3. Split by bold (**text** or __text__)
              const boldParts = cPart.split(/(\*\*.*?\*\*|__.*?__)/g);
              boldParts.forEach(bPart => {
                if (
                  (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) ||
                  (bPart.startsWith('__') && bPart.endsWith('__') && bPart.length >= 4)
                ) {
                  const strong = document.createElement('strong');
                  strong.className = 'font-bold-text';
                  strong.textContent = bPart.slice(2, -2);
                  parent.appendChild(strong);
                } else {
                  // 4. Split by italic (*text* or _text_)
                  const italicParts = bPart.split(/(\*[^*\n]+\*|_[^_\n]+_)/g);
                  italicParts.forEach(iPart => {
                    if (
                      (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) ||
                      (iPart.startsWith('_') && iPart.endsWith('_') && iPart.length > 2)
                    ) {
                      const em = document.createElement('em');
                      em.textContent = iPart.slice(1, -1);
                      parent.appendChild(em);
                    } else if (iPart) {
                      parent.appendChild(document.createTextNode(iPart));
                    }
                  });
                }
              });
            }
          });
        }
      });
    };

    const lines = text.split('\n');
    let i = 0;

    while (i < lines.length) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // 1. Code Block (``` ... ```)
      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++; // skip closing ```
        const pre = document.createElement('pre');
        pre.className = 'markdown-code-block';
        const code = document.createElement('code');
        code.textContent = codeLines.join('\n');
        pre.appendChild(code);
        containerRef.current.appendChild(pre);
        continue;
      }

      // 2. Markdown Table
      const isTableRow = (l: string) => l.trim().startsWith('|') && l.trim().endsWith('|');
      const isTableSeparator = (l: string) => isTableRow(l) && /^\|(\s*:?-+:?\s*\|)+$/.test(l.trim());

      if (isTableRow(rawLine) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const tableLines: string[] = [];
        while (i < lines.length && isTableRow(lines[i])) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const wrapper = document.createElement('div');
          wrapper.className = 'table-responsive my-2';
          const table = document.createElement('table');
          table.className = 'data-table';

          const thead = document.createElement('thead');
          const headerRow = document.createElement('tr');
          const headerCells = tableLines[0].slice(1, -1).split('|').map(c => c.trim());
          headerCells.forEach(cellText => {
            const th = document.createElement('th');
            renderInline(cellText, th);
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          const tbody = document.createElement('tbody');
          for (let r = 2; r < tableLines.length; r++) {
            const bodyRow = document.createElement('tr');
            const cells = tableLines[r].slice(1, -1).split('|').map(c => c.trim());
            cells.forEach(cellText => {
              const td = document.createElement('td');
              renderInline(cellText, td);
              bodyRow.appendChild(td);
            });
            tbody.appendChild(bodyRow);
          }
          table.appendChild(tbody);
          wrapper.appendChild(table);
          containerRef.current.appendChild(wrapper);
        }
        continue;
      }

      // 3. Headings (#, ##, ###, ####, #####, ######) with or without trailing space
      if (/^#{1,6}/.test(trimmed) && !trimmed.startsWith('###-')) {
        const match = trimmed.match(/^#{1,6}/);
        if (match) {
          const level = Math.min(match[0].length, 6);
          let headingText = trimmed.slice(level).trim();

          // If the line had only ### and text is on the next line, consume the next line
          if (!headingText && i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith('#')) {
            i++;
            headingText = lines[i].trim();
          }

          if (headingText) {
            const headingTag = level <= 2 ? 'h3' : level === 3 ? 'h4' : 'h5';
            const h = document.createElement(headingTag);
            h.className = `markdown-heading markdown-h${level}`;
            renderInline(headingText, h);
            containerRef.current.appendChild(h);
            i++;
            continue;
          } else {
            // Stray empty hashes line, skip
            i++;
            continue;
          }
        }
      }

      // 4. Horizontal Rule (---, ***, ___)
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
        const hr = document.createElement('hr');
        hr.className = 'markdown-hr';
        containerRef.current.appendChild(hr);
        i++;
        continue;
      }

      // 5. Blockquote (> quote)
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        const bq = document.createElement('blockquote');
        bq.className = 'markdown-blockquote';
        renderInline(quoteLines.join(' '), bq);
        containerRef.current.appendChild(bq);
        continue;
      }

      // 6. Unordered List (*, -, +, •)
      if (/^(\*|-|\+|\u2022)\s+/.test(trimmed)) {
        const ul = document.createElement('ul');
        ul.className = 'markdown-ul';
        while (i < lines.length && /^(\*|-|\+|\u2022)\s+/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^(\*|-|\+|\u2022)\s+/, '');
          const li = document.createElement('li');
          li.className = 'markdown-li';
          renderInline(itemText, li);
          ul.appendChild(li);
          i++;
        }
        containerRef.current.appendChild(ul);
        continue;
      }

      // 7. Ordered List (1. , 2. , 1) , (1) , etc.)
      if (/^(\d+[\.\)]|\([0-9a-zA-Z]\))\s+/.test(trimmed)) {
        const ol = document.createElement('ol');
        ol.className = 'markdown-ol';
        while (i < lines.length && /^(\d+[\.\)]|\([0-9a-zA-Z]\))\s+/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^(\d+[\.\)]|\([0-9a-zA-Z]\))\s+/, '');
          const li = document.createElement('li');
          li.className = 'markdown-li';
          renderInline(itemText, li);
          ol.appendChild(li);
          i++;
        }
        containerRef.current.appendChild(ol);
        continue;
      }

      // 8. Regular Line / Paragraph
      if (!trimmed) {
        const spacer = document.createElement('div');
        spacer.className = 'markdown-spacer';
        containerRef.current.appendChild(spacer);
      } else {
        const p = document.createElement('p');
        p.className = 'markdown-p';
        renderInline(rawLine, p);
        containerRef.current.appendChild(p);
      }
      i++;
    }
  }, [text]);

  return <div ref={containerRef} className={`math-content ${className}`} />;
};
