import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreModalProps {
  score: number;
  totalMarks: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  score,
  totalMarks,
  accuracy,
  correctCount,
  incorrectCount,
  unattemptedCount,
  onClose,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award style={{ color: '#4f46e5' }} /> Test Performance Scorecard
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="score-stats">
          <div className="stat-box">
            <div className="stat-val">{score} / {totalMarks}</div>
            <div className="stat-label">Total Marks</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: '#10b981' }}>{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: '#10b981' }}>{correctCount}</div>
            <div className="stat-label">Correct (+4)</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '1.1rem' }}>{incorrectCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Incorrect (-1)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#64748b', fontSize: '1.1rem' }}>{unattemptedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Unattempted (0)</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            Review Answers & Solutions
          </button>
        </div>
      </div>
    </div>
  );
};
