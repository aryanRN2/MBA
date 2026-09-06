import React from 'react';
import { PlayCircle, BookOpen } from 'lucide-react';
import type { PaperMeta, TestMode } from '../types';

interface HomeViewProps {
  papers: PaperMeta[];
  onSelectPaper: (filename: string, mode: TestMode) => void;
  onOpenNotes: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ papers, onSelectPaper, onOpenNotes }) => {
  const paper2022 = papers.find(p => p.year === 2022) || papers[0];
  const otherPapers = papers.filter(p => p.year !== 2022);

  return (
    <div className="landing-view">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          <span>Anushka Portal</span>
        </h1>
      </div>

      {/* Clean Minimalist Black Button Launcher */}
      <div className="papers-button-group">
        <div className="primary-launch-row">
          <button
            className="btn-black-pyq main-pyq"
            onClick={() => onSelectPaper(paper2022.filename, 'practice')}
          >
            <PlayCircle size={22} />
            <span>2022 PYQ</span>
          </button>

          <button
            className="btn-black-pyq notes-launch-btn"
            onClick={onOpenNotes}
          >
            <BookOpen size={20} />
            <span>Notes</span>
          </button>
        </div>

        <div className="other-pyq-row">
          {otherPapers.map(paper => (
            <button
              key={paper.id}
              className="btn-black-pyq secondary-pyq disabled"
              disabled
              title="Coming Soon"
            >
              <span>{paper.title}</span>
              <span className="soon-badge">Soon</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
