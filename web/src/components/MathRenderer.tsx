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

    // Helper to render inline content (KaTeX $...$ and **bold**) into a target DOM element
    const renderInline = (str: string, parent: HTMLElement) => {
      // Split by KaTeX $$...$$ or $...$
      const mathParts = str.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      mathParts.forEach(mPart => {
        if (mPart.startsWith('$$') && mPart.endsWith('$$')) {
          const math = mPart.slice(2, -2);
          const div = document.createElement('div');
          div.className = 'katex-block-wrapper my-2';
          try {
            katex.render(math, div, { displayMode: true, throwOnError: false });
          } catch {
            div.textContent = mPart;
          }
          parent.appendChild(div);
        } else if (mPart.startsWith('$') && mPart.endsWith('$')) {
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
          // Check for bold **text**
          const boldParts = mPart.split(/(\*\*.*?\*\*)/g);
          boldParts.forEach(bPart => {
            if (bPart.startsWith('**') && bPart.endsWith('**')) {
              const strong = document.createElement('strong');
              strong.textContent = bPart.slice(2, -2);
              strong.style.fontWeight = '700';
              strong.style.color = 'var(--text-primary)';
              parent.appendChild(strong);
            } else if (bPart) {
              const textNode = document.createTextNode(bPart);
              parent.appendChild(textNode);
            }
          });
        }
      });
    };

    // Split entire text into lines to identify and extract Markdown tables vs regular paragraphs
    const lines = text.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if current line starts a markdown table (e.g. starts with | and next line is table header separator)
      const isTableRow = (l: string) => l.trim().startsWith('|') && l.trim().endsWith('|');
      const isTableSeparator = (l: string) => isTableRow(l) && /^\|(\s*:?-+:?\s*\|)+$/.test(l.trim());

      if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        // We have a Markdown Table!
        const tableLines: string[] = [];
        while (i < lines.length && isTableRow(lines[i])) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const wrapper = document.createElement('div');
          wrapper.className = 'table-responsive';

          const table = document.createElement('table');
          table.className = 'data-table';

          // Header Row (tableLines[0])
          const thead = document.createElement('thead');
          const headerRow = document.createElement('tr');
          const headerCells = tableLines[0]
            .slice(1, -1)
            .split('|')
            .map(c => c.trim());

          headerCells.forEach(cellText => {
            const th = document.createElement('th');
            renderInline(cellText, th);
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          // Body Rows (tableLines[2...])
          const tbody = document.createElement('tbody');
          for (let r = 2; r < tableLines.length; r++) {
            const bodyRow = document.createElement('tr');
            const cells = tableLines[r]
              .slice(1, -1)
              .split('|')
              .map(c => c.trim());

            cells.forEach(cellText => {
              const td = document.createElement('td');
              renderInline(cellText, td);
              bodyRow.appendChild(td);
            });
            tbody.appendChild(bodyRow);
          }
          table.appendChild(tbody);
          wrapper.appendChild(table);
          containerRef.current?.appendChild(wrapper);
        }
      } else {
        // Regular line / paragraph
        const p = document.createElement('div');
        p.className = 'text-line';
        renderInline(line, p);
        
        // Preserve empty line spacing if line was empty
        if (!line.trim()) {
          p.style.minHeight = '0.75rem';
        }

        containerRef.current?.appendChild(p);
        i++;
      }
    }
  }, [text]);

  return <div ref={containerRef} className={`math-content ${className}`} />;
};
