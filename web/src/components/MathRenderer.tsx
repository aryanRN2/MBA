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
        // Regular text (handle newlines)
        const textNode = document.createElement('span');
        textNode.innerText = part;
        containerRef.current?.appendChild(textNode);
      }
    });
  }, [text]);

  return <div ref={containerRef} className={`math-content ${className}`} style={{ whiteSpace: 'pre-wrap' }} />;
};
