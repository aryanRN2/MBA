import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  Zap,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import type { Question } from '../types';
import { MathRenderer } from './MathRenderer';

interface AskAIChatModalProps {
  question: Question;
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

export const AskAIChatModal: React.FC<AskAIChatModalProps> = ({ question, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hello! I'm your **CUET PG MBA AI Tutor**. I have loaded **Question ${question.question_number}** (*${question.section}*).\n\nWhat doubt do you have regarding this problem? You can click a shortcut prompt below or type your question!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Construct context-rich system prompt for the specific question
  const buildSystemPrompt = () => {
    const optsStr = Object.entries(question.options || {})
      .map(([k, v]) => `Option (${k}): ${v}`)
      .join('\n');

    return `You are an expert, encouraging, and highly articulate CUET PG MBA Exam Tutor.
You are helping a student with the following specific exam question:

---
[QUESTION DETAILS]
Paper: ${question.paper_name || 'CUET PG MBA'}
Question Number: ${question.question_number}
Section: ${question.section}
Question Text: ${question.question_en || question.question}
Options:
${optsStr}
Correct Option: ${question.correct_option} (${question.correct_answer || ''})
Official Explanation/Solution: ${question.explanation || 'Not provided'}
---

GUIDELINES FOR YOUR RESPONSES:
1. Provide extremely clear, step-by-step conceptual and mathematical explanations.
2. Use LaTeX formatted math formulas with $...$ for inline formulas and $$...$$ for block equations so the renderer displays them cleanly.
3. Highlight smart shortcuts, elimination tricks, and quick calculation methods suited for the 90-105 minute CUET PG MBA exam.
4. Be polite, concise, and directly address the student's specific doubt.`;
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
      };

      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEFAULT_NVIDIA_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `NVIDIA API error (Status ${res.status})`);
      }

      const data = await res.json();
      const botResponse =
        data.choices?.[0]?.message?.content ||
        'I could not generate an answer at this moment. Please try asking again.';

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: botResponse,
        },
      ]);
    } catch (err: any) {
      console.error('AI Tutor error:', err);
      setError(err.message || 'Failed to connect to AI Tutor.');
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Connection Error**: ${err.message || 'Unable to reach NVIDIA NIM service. Please check your network and try again.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="ask-ai-modal-overlay" onClick={onClose}>
      <div className="ask-ai-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ask-ai-header">
          <div className="ask-ai-title-wrap">
            <div className="ai-sparkle-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="ask-ai-title">Ask AI Tutor — Q{question.question_number}</h3>
              <span className="ask-ai-subtitle">{question.section}</span>
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
            <button className="ai-btn-close" onClick={onClose} title="Close AI Tutor">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Question Context Banner */}
        <div className="ai-question-summary-banner">
          <span className="ai-banner-label">Active Question:</span>
          <div className="ai-banner-text">
            <MathRenderer text={question.question_en || question.question} />
          </div>
        </div>

        {/* Chat History */}
        <div className="ask-ai-chat-body">
          {messages.map(msg => {
            const isBot = msg.role === 'assistant';
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

          {isLoading && (
            <div className="chat-message-row bot-row">
              <div className="chat-avatar bot-avatar">
                <Bot size={16} />
              </div>
              <div className="chat-bubble bot-bubble loading-bubble">
                <Loader2 size={16} className="spinner-icon" />
                <span>Thinking with Llama 3.2 Vision...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="ai-suggestions-row">
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

        {/* Input Bar */}
        <div className="ask-ai-footer">
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
  );
};
