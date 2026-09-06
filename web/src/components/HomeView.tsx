import React from 'react';
import { PlayCircle } from 'lucide-react';
import type { PaperMeta, TestMode } from '../types';

interface HomeViewProps {
  papers: PaperMeta[];
  onSelectPaper: (filename: string, mode: TestMode) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ papers, onSelectPaper }) => {
  const paper2022 = papers.find(p => p.year === 2022) || papers[0];
  const otherPapers = papers.filter(p => p.year !== 2022);

  return (
    <div className="landing-view">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          <span>Anushka Portal</span>
        </h1>

        <p className="hero-desc">
          Practice 100% verified bilingual questions, KaTeX formula rendering, on-demand step-by-step mathematical explanations, and full-length timed mock tests.
        </p>
      </div>

      {/* Clean Minimalist Black Button Launcher */}
      <div className="papers-button-group">
        <button
          className="btn-black-pyq main-pyq"
          onClick={() => onSelectPaper(paper2022.filename, 'practice')}
        >
          <PlayCircle size={22} />
          <span>2022 PYQ</span>
        </button>

        <div className="other-pyq-row">
          {otherPapers.map(paper => (
            <button
              key={paper.id}
              className="btn-black-pyq secondary-pyq"
              onClick={() => onSelectPaper(paper.filename, 'practice')}
            >
              {paper.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
