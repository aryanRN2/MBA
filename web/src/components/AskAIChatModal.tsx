import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  Zap,
  HelpCircle,
  Calculator,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { Question } from '../types';
import { MathRenderer } from './MathRenderer';

interface AskAIChatModalProps {
  question: Question;
  initialPrompt?: string;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_NVIDIA_API_KEY =
  (import.meta as any).env?.VITE_NVIDIA_API_KEY ||
  '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';

const DEFAULT_NVIDIA_MODEL =
  (import.meta as any).env?.VITE_NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

export const AskAIChatModal: React.FC<AskAIChatModalProps> = ({
  question,
  initialPrompt,
  onClose,
}) => {
  const [isWide, setIsWide] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hello! I'm your AI Tutor for **Question ${question.question_number}**. How can I help you? Choose an action below or ask any doubt!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoPrompted = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Construct context-rich system prompt for the specific question
  const buildSystemPrompt = () => {
    const optsStr = Object.entries(question.options || {})
      .map(([k, v]) => `Option (${k}): ${v}`)
      .join('\n');

    return `You are an expert CUET PG MBA Exam Tutor.
Provide a clean, beautifully formatted step-by-step explanation for this question:

---
[QUESTION DETAILS]
Paper: ${question.paper_name || 'CUET PG MBA'}
Question Number: ${question.question_number}
Section: ${question.section}
Question: ${question.question_en || question.question}
Options:
${optsStr}
Correct Option: Option (${question.correct_option}) ${question.correct_answer ? `(${question.correct_answer})` : ''}
Official Explanation: ${question.explanation || 'Not provided'}
---

OUTPUT FORMATTING INSTRUCTIONS:
Always format your response with clean Markdown:
1. Use standard Markdown headings:
   ### 1. Correct Option Analysis
   Explain why Option (${question.correct_option}) is the correct answer and the underlying concept or rule.

   ### 2. Why Other Options Are Incorrect
   Briefly explain why the other options do not fit.

   ### 3. Exam Shortcut & Strategy
   Give a quick tip or elimination trick for the exam.

2. Always properly close bold tags with two asterisks on both sides (e.g. **Bold Title:** followed by text).
3. Use LaTeX formatting ($...$ for inline and $$...$$ for block math) whenever math formulas or symbols appear.
4. Keep the explanation concise, direct, and encouraging.`;
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);
    setError(null);

    const botId = `bot-${Date.now()}`;
    // Insert placeholder bot message for real-time streaming
    setMessages(prev => [...prev, { id: botId, role: 'assistant', content: '' }]);

    try {
      // Build conversation payload
      const conversationHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const payload = {
        model: DEFAULT_NVIDIA_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...conversationHistory,
        ],
        temperature: 0.3,
        max_tokens: 1024,
        stream: true,
      };

      // Call our serverless /api/chat endpoint to eliminate CORS issues and stream on Vercel
      let res: Response;
      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch {
        // Fallback to direct NVIDIA endpoint if running in an environment without serverless proxy
        res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DEFAULT_NVIDIA_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || `API error (Status ${res.status})`);
      }

      // Read streaming SSE body with proper line buffering
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let isDone = false;
        let lineBuffer = '';

        while (!isDone) {
          const { value, done } = await reader.read();
          if (done) break;

          lineBuffer += decoder.decode(value, { stream: true });
          const lines = lineBuffer.split('\n');
          // Retain any incomplete line in lineBuffer for the next network packet
          lineBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const dataStr = trimmed.replace(/^data:\s*/, '');
            if (dataStr === '[DONE]') {
              isDone = true;
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedText += delta;
                setMessages(prev =>
                  prev.map(m => (m.id === botId ? { ...m, content: accumulatedText } : m))
                );
              }
            } catch {
              // Ignore invalid lines
            }
          }
        }

        // Process any trailing data in lineBuffer
        if (lineBuffer.trim().startsWith('data:')) {
          const dataStr = lineBuffer.trim().replace(/^data:\s*/, '');
          if (dataStr !== '[DONE]') {
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedText += delta;
                setMessages(prev =>
                  prev.map(m => (m.id === botId ? { ...m, content: accumulatedText } : m))
                );
              }
            } catch {}
          }
        }

        if (!accumulatedText) {
          const fallbackData = await res.json().catch(() => ({}));
          const fallbackText = fallbackData.choices?.[0]?.message?.content || 'Explanation generated.';
          setMessages(prev =>
            prev.map(m => (m.id === botId ? { ...m, content: fallbackText } : m))
          );
        }
      }
    } catch (err: any) {
      console.error('AI Tutor error:', err);
      setError(err.message || 'Failed to connect to AI Tutor.');
      setMessages(prev =>
        prev.map(m =>
          m.id === botId
            ? {
                ...m,
                content: `⚠️ **Connection Error**: ${err.message || 'Unable to reach NVIDIA NIM service. Please try again.'}`,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-trigger initial prompt if provided
  useEffect(() => {
    if (initialPrompt && !hasAutoPrompted.current) {
      hasAutoPrompted.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: `Chat reset for **Question ${question.question_number}**. How can I help you?`,
      },
    ]);
    setError(null);
  };

  return (
    <div className="ask-ai-drawer-overlay" onClick={onClose}>
      <div
        className={`ask-ai-drawer ${isWide ? 'wide-drawer' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="ask-ai-drawer-header">
          <div className="ask-ai-title-wrap">
            <div className="ai-sparkle-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="ask-ai-title">Ask AI Tutor — Q{question.question_number}</h3>
              <span className="ask-ai-tag">NVIDIA NIM • Llama 3.2</span>
            </div>
          </div>

          <div className="ask-ai-header-actions">
            <button
              className="ai-btn-reset"
              onClick={handleResetChat}
              title="Reset conversation"
            >
              <RotateCcw size={14} />
            </button>
            <button
              className="ai-btn-fullscreen"
              onClick={() => setIsWide(!isWide)}
              title={isWide ? 'Standard Width' : 'Wider View'}
            >
              {isWide ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button className="ai-btn-close" onClick={onClose} title="Close AI Tutor">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="ask-ai-chat-body">
          <div className="ask-ai-content-container">
            {messages.map(msg => {
              const isBot = msg.role === 'assistant';
              if (isBot && !msg.content && isLoading) {
                return (
                  <div key={msg.id} className="chat-message-row bot-row">
                    <div className="chat-avatar bot-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="chat-bubble bot-bubble loading-bubble">
                      <Loader2 size={16} className="spinner-icon" />
                      <span>Thinking with Llama 3.2 Vision...</span>
                    </div>
                  </div>
                );
              }
              if (isBot && !msg.content) return null;

              return (
                <div key={msg.id} className={`chat-message-row ${isBot ? 'bot-row' : 'user-row'}`}>
                  <div className={`chat-avatar ${isBot ? 'bot-avatar' : 'user-avatar'}`}>
                    {isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
                    <MathRenderer text={msg.content} />
                  </div>
                </div>
              );
            })}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="ai-suggestions-row">
          <div className="ai-suggestions-inner">
            <button
              className="ai-chip"
              onClick={() => handleSendMessage('Please provide a detailed step-by-step solution for this question.')}
              disabled={isLoading}
            >
              <Calculator size={13} />
              <span>Step-by-step solution</span>
            </button>

            <button
              className="ai-chip"
              onClick={() => handleSendMessage('What is the fastest shortcut or elimination trick to solve this in under 45 seconds?')}
              disabled={isLoading}
            >
              <Zap size={13} />
              <span>Shortcut trick</span>
            </button>

            <button
              className="ai-chip"
              onClick={() => handleSendMessage(`Why is Option (${question.correct_option}) the correct answer and why are other options wrong?`)}
              disabled={isLoading}
            >
              <HelpCircle size={13} />
              <span>Explain correct option</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="ask-ai-footer">
          <div className="ask-ai-footer-inner">
            <div className="ai-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="ai-text-input"
                placeholder="Ask any doubt about this question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="btn-send-ai"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 size={16} className="spinner-icon" /> : <Send size={16} />}
              </button>
            </div>
            <div className="ai-footer-model-tag">
              Powered by <strong>NVIDIA NIM</strong> • {DEFAULT_NVIDIA_MODEL.split('/')[1] || 'Llama 3.2'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
