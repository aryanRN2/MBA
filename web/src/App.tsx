import { useState, useEffect, useCallback } from 'react';
import type { Question, OptionKey, PaperMeta, TestMode } from './types';
import { HomeView } from './components/HomeView';
import { TestPlayer } from './components/TestPlayer';
import { ScoreModal } from './components/ScoreModal';
import { AuthGate } from './components/AuthGate';
import { UserCheck, LogOut } from 'lucide-react';
import './index.css';

const PAPERS: PaperMeta[] = [
  {
    id: '2022',
    filename: 'CUET_PG_MBA_2022.json',
    year: 2022,
    title: '2022 PYQ',
    subtitle: 'COQP12 / PGQP38 — Official Shift 1 Paper',
    questionCount: 100,
    totalMarks: 400,
    durationMinutes: 120,
    isFeatured: true,
  },
  {
    id: '2023',
    filename: 'CUET_PG_MBA_2023.json',
    year: 2023,
    title: '2023 PYQ',
    subtitle: 'COQP12 Official Question Paper',
    questionCount: 100,
    totalMarks: 400,
    durationMinutes: 120,
  },
  {
    id: '2024',
    filename: 'CUET_PG_MBA_2024.json',
    year: 2024,
    title: '2024 PYQ',
    subtitle: 'COQP12 Official Question Paper',
    questionCount: 75,
    totalMarks: 300,
    durationMinutes: 105,
  },
  {
    id: '2025',
    filename: 'CUET_PG_MBA_2025.json',
    year: 2025,
    title: '2025 PYQ',
    subtitle: 'COQP12 Official Question Paper',
    questionCount: 75,
    totalMarks: 300,
    durationMinutes: 105,
  },
  {
    id: '2026',
    filename: 'CUET_PG_MBA_2026.json',
    year: 2026,
    title: '2026 Mock Paper',
    subtitle: 'COQP12 Complete Practice Mock',
    questionCount: 75,
    totalMarks: 300,
    durationMinutes: 105,
  },
  {
    id: 'all',
    filename: 'CUET_PG_MBA_All_PYQs.json',
    year: 2027,
    title: 'All PYQs (425 Qs)',
    subtitle: 'Master Question Bank across all years',
    questionCount: 425,
    totalMarks: 1700,
    durationMinutes: 300,
  },
];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('anushka_portal_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.isAuthenticated);
      }
    } catch {
      // Fallback
    }
    return false;
  });

  const [authenticatedUser, setAuthenticatedUser] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('anushka_portal_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.userId || 'Student';
      }
    } catch {
      // Fallback
    }
    return 'Student';
  });

  const [view, setView] = useState<'home' | 'player'>('home');
  const [currentPaper, setCurrentPaper] = useState<PaperMeta>(PAPERS[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mode, setMode] = useState<TestMode>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, OptionKey>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [timerSeconds, setTimerSeconds] = useState(7200);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('anushka_portal_auth');
    setIsAuthenticated(false);
    setView('home');
  };

  // Load questions for the selected paper
  const loadPaper = useCallback(async (paper: PaperMeta) => {
    try {
      const res = await fetch(`CUET_PG_MBA_JSON/${paper.filename}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Question[] = await res.json();
      setQuestions(data);
      setCurrentIndex(0);
      setSelectedOptions({});
      setRevealedAnswers({});
      setFlaggedQuestions({});
      setExamSubmitted(false);
      setTimerSeconds(paper.durationMinutes * 60);
    } catch (err) {
      console.error('Failed to load paper:', err);
    }
  }, []);

  // Launch test from Home
  const handleSelectPaper = async (filename: string, testMode: TestMode = 'practice') => {
    const paper = PAPERS.find(p => p.filename === filename) || PAPERS[0];
    setCurrentPaper(paper);
    setMode(testMode);
    await loadPaper(paper);
    setView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Change paper inside player
  const handlePaperChange = async (filename: string) => {
    const paper = PAPERS.find(p => p.filename === filename) || PAPERS[0];
    setCurrentPaper(paper);
    await loadPaper(paper);
  };

  // Exam Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (view === 'player' && mode === 'exam' && !examSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, mode, examSubmitted, timerSeconds]);

  // Submit Exam & Calculate Score
  const handleSubmitExam = () => {
    setExamSubmitted(true);
    setShowScoreModal(true);
  };

  // Compute stats
  const calculateScore = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach(q => {
      const userOpt = selectedOptions[q.question_number];
      const correctOpt = String(q.correct_option).trim();

      if (!userOpt) {
        unattempted++;
      } else if (String(userOpt).trim() === correctOpt) {
        correct++;
        score += 4;
      } else {
        incorrect++;
        score -= 1;
      }
    });

    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    return { score, correct, incorrect, unattempted, accuracy };
  };

  const { score, correct, incorrect, unattempted, accuracy } = calculateScore();

  if (!isAuthenticated) {
    return (
      <AuthGate
        onLoginSuccess={(userId) => {
          setAuthenticatedUser(userId);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="app-root">
      {/* Top Floating User Status Bar */}
      <header className="portal-top-bar">
        <div className="portal-brand-mini">
          <span className="portal-logo-dot"></span>
          <span className="portal-name">Anushka Portal</span>
        </div>
        <div className="user-profile-badge">
          <UserCheck size={15} style={{ color: '#9333ea' }} />
          <span className="user-id-text">Student: {authenticatedUser}</span>
          <button onClick={handleLogout} className="btn-logout" title="Log out">
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {view === 'home' ? (
        <HomeView papers={PAPERS} onSelectPaper={handleSelectPaper} />
      ) : (
        <TestPlayer
          questions={questions}
          currentPaper={currentPaper}
          allPapers={PAPERS}
          mode={mode}
          onPaperChange={handlePaperChange}
          onModeChange={setMode}
          onBackToHome={() => setView('home')}
          onSubmitExam={handleSubmitExam}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          revealedAnswers={revealedAnswers}
          setRevealedAnswers={setRevealedAnswers}
          flaggedQuestions={flaggedQuestions}
          setFlaggedQuestions={setFlaggedQuestions}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          timerSeconds={timerSeconds}
          examSubmitted={examSubmitted}
        />
      )}

      {showScoreModal && (
        <ScoreModal
          score={score}
          totalMarks={questions.length * 4}
          accuracy={accuracy}
          correctCount={correct}
          incorrectCount={incorrect}
          unattemptedCount={unattempted}
          onClose={() => setShowScoreModal(false)}
        />
      )}
    </div>
  );
}

export default App;
