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

    // Split text by LaTeX math delimiters $$...$$ and $...$
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    
    containerRef.current.innerHTML = '';

    parts.forEach(part => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        const span = document.createElement('div');
        span.className = 'katex-block-wrapper my-2';
        try {
          katex.render(math, span, { displayMode: true, throwOnError: false });
        } catch {
          span.textContent = part;
        }
        containerRef.current?.appendChild(span);
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        const span = document.createElement('span');
        span.className = 'katex-inline-wrapper';
        try {
          katex.render(math, span, { displayMode: false, throwOnError: false });
        } catch {
          span.textContent = part;
        }
        containerRef.current?.appendChild(span);
      } else {
        // Regular text (handle newlines and **bold** syntax)
        const textWrapper = document.createElement('span');
        // If part contains **bold**, split and style
        if (part.includes('**')) {
          const boldParts = part.split(/(\*\*.*?\*\*)/g);
          boldParts.forEach(bPart => {
            if (bPart.startsWith('**') && bPart.endsWith('**')) {
              const strong = document.createElement('strong');
              strong.innerText = bPart.slice(2, -2);
              strong.className = 'font-bold text-slate-900 dark:text-slate-100';
              textWrapper.appendChild(strong);
            } else {
              const tSpan = document.createElement('span');
              tSpan.innerText = bPart;
              textWrapper.appendChild(tSpan);
            }
          });
        } else {
          textWrapper.innerText = part;
        }
        containerRef.current?.appendChild(textWrapper);
      }
    });
  }, [text]);

  return <div ref={containerRef} className={`math-content leading-relaxed ${className}`} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} />;
};
