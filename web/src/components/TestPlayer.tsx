import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Hourglass,
  Lightbulb,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import type { Question, OptionKey, TestMode } from '../types';
import { MathRenderer } from './MathRenderer';
import { AskAIChatModal } from './AskAIChatModal';

interface TestPlayerProps {
  questions: Question[];
  mode: TestMode;
  onBackToHome: () => void;
  onSubmitExam: () => void;
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  selectedOptions: Record<number, OptionKey>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<number, OptionKey>>>;
  revealedAnswers: Record<number, boolean>;
  setRevealedAnswers: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  flaggedQuestions: Record<number, boolean>;
  setFlaggedQuestions: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  selectedSection: string;
  setSelectedSection: (sec: string) => void;
  timerSeconds: number;
  examSubmitted: boolean;
}

export const TestPlayer: React.FC<TestPlayerProps> = ({
  questions,
  mode,
  onBackToHome,
  onSubmitExam,
  currentIndex,
  setCurrentIndex,
  selectedOptions,
  setSelectedOptions,
  revealedAnswers,
  setRevealedAnswers,
  flaggedQuestions,
  setFlaggedQuestions,
  selectedSection,
  setSelectedSection,
  timerSeconds,
  examSubmitted,
}) => {
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const questionCardRef = useRef<HTMLElement>(null);

  const scrollToQuestionCard = () => {
    if (questionCardRef.current) {
      questionCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter questions based on section
  const filteredQuestions = useMemo(() => {
    if (selectedSection === 'ALL') return questions;
    return questions.filter(q =>
      (q.section || '').toLowerCase().includes(selectedSection.toLowerCase())
    );
  }, [questions, selectedSection]);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const qNum = currentQuestion?.question_number;
  const isRevealed = revealedAnswers[qNum] || false;
  const isFlagged = flaggedQuestions[qNum] || false;
  const selectedOpt = selectedOptions[qNum];

  // Option selection
  const handleSelectOption = useCallback((key: OptionKey) => {
    if (mode === 'exam' && examSubmitted) return;
    if (!qNum) return;

    setSelectedOptions(prev => {
      if (prev[qNum] === key) {
        const next = { ...prev };
        delete next[qNum];
        return next;
      }
      return { ...prev, [qNum]: key };
    });
  }, [mode, examSubmitted, qNum, setSelectedOptions]);

  // Reveal toggle
  const toggleReveal = useCallback(() => {
    if (!qNum) return;
    setRevealedAnswers(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  }, [qNum, setRevealedAnswers]);

  // Flag toggle
  const toggleFlag = useCallback(() => {
    if (!qNum) return;
    setFlaggedQuestions(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  }, [qNum, setFlaggedQuestions]);

  // Navigation
  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToQuestionCard();
    }
  }, [currentIndex, filteredQuestions.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToQuestionCard();
    }
  }, [currentIndex, setCurrentIndex]);

  // Select question from palette
  const handlePaletteSelect = (idx: number) => {
    setCurrentIndex(idx);
    setIsMobilePaletteOpen(false);
    scrollToQuestionCard();
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        handlePrev();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectOption(e.key as OptionKey);
      } else if (['a', 'A'].includes(e.key)) {
        handleSelectOption('1');
      } else if (['b', 'B'].includes(e.key)) {
        handleSelectOption('2');
      } else if (['c', 'C'].includes(e.key)) {
        handleSelectOption('3');
      } else if (['d', 'D'].includes(e.key)) {
        handleSelectOption('4');
      } else if (e.key === 'r' || e.key === 'R') {
        toggleReveal();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleSelectOption, toggleReveal, toggleFlag]);

  // Format timer
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedOptions).length;
  const flaggedCount = Object.keys(flaggedQuestions).length;

  if (!currentQuestion) {
    return <div className="p-8 text-center text-gray-500">Loading questions...</div>;
  }

  const renderPaletteContent = () => (
    <>
      <div className="palette-header">
        <h2 className="palette-title">Question Palette</h2>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
          <span>{answeredCount}</span> / <span>{questions.length}</span>
        </div>
      </div>

      <div className="legend-grid">
        <div className="legend-item">
          <div className="legend-dot dot-current"></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dot-answered"></div>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dot-flagged"></div>
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dot-unanswered"></div>
          <span>Unanswered</span>
        </div>
      </div>

      <div className="palette-grid">
        {filteredQuestions.map((q, idx) => {
          const num = q.question_number;
          const isAnswered = !!selectedOptions[num];
          const isFlag = !!flaggedQuestions[num];
          const isCurrent = idx === currentIndex;

          let btnClass = 'palette-btn';
          if (isCurrent) btnClass += ' current';
          else if (isFlag) btnClass += ' flagged';
          else if (isAnswered) btnClass += ' answered';

          return (
            <button
              key={num}
              className={btnClass}
              onClick={() => handlePaletteSelect(idx)}
            >
              {num}
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="test-player-view">
      <main className="main-content">
        
        {/* Player Top Navigation Bar (Clean Back & Current Title) */}
        <div className="player-top-bar">
          <div className="player-top-row-left">
            <button className="nav-home-btn" onClick={onBackToHome}>
              <ArrowLeft size={15} /> Back to Papers
            </button>
          </div>

          <div className="player-top-row-right">
            {mode === 'exam' && (
              <div className="timer-box">
                <Hourglass size={16} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            )}

            {mode === 'exam' && !examSubmitted && (
              <button className="btn-primary" onClick={onSubmitExam}>
                <CheckCircle size={16} /> Finish Test
              </button>
            )}
          </div>
        </div>

        {/* Section Filters */}
        <div className="filter-bar">
          <div className="section-tabs">
            {['ALL', 'Language', 'Quantitative', 'Logical', 'Data Interpretation'].map(sec => (
              <button
                key={sec}
                className={`section-tab ${selectedSection === sec ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSection(sec);
                  setCurrentIndex(0);
                }}
              >
                {sec === 'ALL' ? 'All Sections' : sec === 'Language' ? 'Verbal & English' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Question Palette Toggle Banner & Drawer (Upper Side on Mobile) */}
        <div className="mobile-palette-container">
          <button
            className="mobile-palette-toggle-btn"
            onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
          >
            <div className="mobile-palette-btn-left">
              <LayoutGrid size={17} />
              <span>Select Question ({answeredCount}/{questions.length} Answered)</span>
            </div>
            {isMobilePaletteOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isMobilePaletteOpen && (
            <div className="mobile-palette-drawer">
              {renderPaletteContent()}
            </div>
          )}
        </div>

        {/* Central Question Card */}
        <section ref={questionCardRef} className="question-card">
          <div className="question-header">
            <div className="q-meta">
              <span className="q-number-badge">Question {qNum}</span>
              <span className="q-section-badge">{currentQuestion.section}</span>
            </div>

            <div className="q-actions">
              <button
                className="action-btn-ai"
                onClick={() => setIsAskAIOpen(true)}
                title="Ask AI Tutor about this problem"
              >
                <Sparkles size={14} />
                <span>Ask AI</span>
              </button>

              <button
                className={`action-btn-sm ${isFlagged ? 'flagged' : ''}`}
                onClick={toggleFlag}
              >
                {isFlagged ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {isFlagged ? 'Flagged' : 'Flag for Review'}
              </button>
            </div>
          </div>

          {/* Question Text with KaTeX (English Only) */}
          <div className="question-body">
            <div className="question-text-en">
              <MathRenderer text={currentQuestion.question_en || currentQuestion.question} />
            </div>

            {/* High-Resolution Data Interpretation Chart */}
            {currentQuestion.chart_image && (
              <div className="chart-container">
                <img
                  src={currentQuestion.chart_image}
                  alt={`Question ${qNum} Chart`}
                  className="chart-image"
                />
                <div className="chart-caption">Data Visualization Chart (High-Resolution)</div>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="options-list">
            {(['1', '2', '3', '4'] as OptionKey[]).map((key) => {
              const optVal = currentQuestion.options?.[key];
              if (!optVal) return null;

              const isSelected = selectedOpt === key;
              const isCorrect = isRevealed && (String(key) === String(currentQuestion.correct_option));
              const isIncorrect = isRevealed && isSelected && (String(key) !== String(currentQuestion.correct_option));

              let itemClass = 'option-item';
              if (isSelected) itemClass += ' selected';
              if (isCorrect) itemClass += ' correct-revealed';
              if (isIncorrect) itemClass += ' incorrect-revealed';

              return (
                <div
                  key={key}
                  className={itemClass}
                  onClick={() => handleSelectOption(key)}
                >
                  <div className="option-key">{key}</div>
                  <div className="option-text">
                    <MathRenderer text={optVal} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step-by-Step Explanation Box */}
          {(isRevealed || (mode === 'exam' && examSubmitted)) && (
            <div className="explanation-box">
              <div className="explanation-title">
                <Lightbulb size={18} style={{ color: '#16a34a' }} />
                <span>Step-by-Step Mathematical & Conceptual Explanation</span>
              </div>
              <div className="explanation-content">
                <MathRenderer text={currentQuestion.explanation || `Correct option is (${currentQuestion.correct_option}).`} />
              </div>
            </div>
          )}
        </section>

        {/* Bottom Navigation Footer */}
        <div className="nav-footer">
          <button
            className="btn-secondary"
            disabled={currentIndex === 0}
            onClick={handlePrev}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          {(mode === 'practice' || examSubmitted) && (
            <button className="btn-reveal" onClick={toggleReveal}>
              {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
              {isRevealed ? 'Hide Explanation' : 'Reveal Answer & Explanation'}
            </button>
          )}

          <button
            className="btn-primary"
            disabled={currentIndex === filteredQuestions.length - 1}
            onClick={handleNext}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

        <div className="shortcut-hint">
          Keyboard Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> Select Option | <kbd>R</kbd> Reveal Answer | <kbd>→</kbd> Next | <kbd>←</kbd> Prev | <kbd>M</kbd> Mark
        </div>

      </main>

      {/* Desktop Side Question Palette */}
      <aside className="palette-sidebar desktop-palette">
        {renderPaletteContent()}
      </aside>

      {/* AI Tutor Chatbot Modal */}
      {isAskAIOpen && (
        <AskAIChatModal
          question={currentQuestion}
          onClose={() => setIsAskAIOpen(false)}
        />
      )}
    </div>
  );
};
