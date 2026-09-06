import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  Folder,
  Layers,
  Compass,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface SubjectNote {
  id: string;
  title: string;
  code: string;
  description: string;
  pdfUrl?: string;
  isAvailable: boolean;
  docCount: number;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  tags: string[];
}

const SUBJECTS_DATA: SubjectNote[] = [
  {
    id: 'abstract-algebra',
    title: 'Abstract Algebra',
    code: 'MATH-AA',
    description: 'Dummit & Foote Monograph — Comprehensive notes on Groups, Subgroups, Rings, Fields, Homomorphisms and Ideals.',
    pdfUrl: '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf',
    isAvailable: true,
    docCount: 1,
    icon: Layers,
    accentColor: '#6366f1',
    tags: ['Group Theory', 'Ring Theory', 'Fields', 'Dummit & Foote'],
  },
  {
    id: 'numerical-analysis',
    title: 'Numerical Analysis',
    code: 'MATH-NA',
    description: 'Error analysis, Root Finding (Newton-Raphson, Bisection), Interpolation (Newton/Lagrange), Numerical Integration and ODEs.',
    pdfUrl: '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf',
    isAvailable: true,
    docCount: 1,
    icon: Cpu,
    accentColor: '#0ea5e9',
    tags: ['Root Finding', 'Interpolation', 'Integration', 'ODEs'],
  },
  {
    id: 'metric-spaces',
    title: 'Metric Spaces',
    code: 'MATH-MS',
    description: 'Metrics, Open and Closed Sets, Convergence, Completeness (Banach Fixed Point), Compactness, and Connectedness.',
    pdfUrl: '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf',
    isAvailable: true,
    docCount: 1,
    icon: Compass,
    accentColor: '#f59e0b',
    tags: ['Topology', 'Completeness', 'Compactness', 'Continuity'],
  },
  {
    id: 'analytical-geometry',
    title: 'Analytical Geometry',
    code: 'MATH-AG',
    description: '2D and 3D Coordinate Geometry, Straight Lines, Planes, Conic Sections (Parabola, Ellipse, Hyperbola), Spheres and Cones.',
    pdfUrl: '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf',
    isAvailable: true,
    docCount: 1,
    icon: Folder,
    accentColor: '#ec4899',
    tags: ['3D Geometry', 'Conic Sections', 'Planes', 'Spheres'],
  },
];

interface NotesViewProps {
  onBackToHome: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onBackToHome }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const activeSubject = SUBJECTS_DATA.find(s => s.id === selectedSubjectId);

  // If a subject is selected, render the PDF Viewer for that subject
  if (activeSubject && activeSubject.pdfUrl) {
    return (
      <div className="notes-view-root">
        {/* PDF Top Navigation Bar */}
        <div className="notes-top-bar">
          <div className="notes-top-nav-group">
            <button className="nav-home-btn" onClick={() => setSelectedSubjectId(null)}>
              <ArrowLeft size={16} /> Back to Subjects
            </button>
            <button className="nav-home-subtle-btn" onClick={onBackToHome}>
              Home
            </button>
          </div>

          <div className="notes-brand-title">
            <activeSubject.icon size={18} style={{ color: activeSubject.accentColor }} />
            <span>{activeSubject.title} — Class Notes</span>
          </div>

          <div className="notes-top-actions">
            <a
              href={activeSubject.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="notes-action-btn"
              title="Open in new tab"
            >
              <ExternalLink size={15} />
              <span>Open in New Tab</span>
            </a>
            <a
              href={activeSubject.pdfUrl}
              download={`${activeSubject.title.replace(/\s+/g, '_')}_Notes.pdf`}
              className="notes-action-btn"
              title="Download PDF"
            >
              <Download size={15} />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* PDF Container */}
        <div className="notes-pdf-container">
          <div className="notes-pdf-header">
            <div className="pdf-header-info">
              <FileText size={22} style={{ color: activeSubject.accentColor }} />
              <div>
                <h2 className="pdf-doc-title">{activeSubject.title} Notes</h2>
                <p className="pdf-doc-subtitle">{activeSubject.description}</p>
              </div>
            </div>
            <a
              href={activeSubject.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-sm"
              style={{ background: activeSubject.accentColor }}
            >
              <ExternalLink size={14} /> Fullscreen Tab
            </a>
          </div>

          <div className="pdf-viewer-frame-wrapper">
            <iframe
              src={`${activeSubject.pdfUrl}#toolbar=1&navpanes=0`}
              title={`${activeSubject.title} PDF Viewer`}
              className="notes-pdf-iframe"
            />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the 4 Subject Selection Boxes Grid
  return (
    <div className="notes-view-root">
      {/* Top Header */}
      <div className="notes-top-bar">
        <button className="nav-home-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="notes-brand-title">
          <Folder size={18} style={{ color: 'var(--primary)' }} />
          <span>Class Notes & Study Materials</span>
        </div>
      </div>

      {/* Hero Welcome / Prompt */}
      <div className="notes-subject-hero">
        <h2 className="subject-hero-title">Select a Subject to View Notes</h2>
        <p className="subject-hero-desc">
          Browse verified university class notes, monographs, formula summaries, and solved examples.
        </p>
      </div>

      {/* 4 Subject Boxes Grid */}
      <div className="subject-cards-grid">
        {SUBJECTS_DATA.map(subj => {
          const Icon = subj.icon;
          return (
            <div
              key={subj.id}
              className="subject-card"
              onClick={() => setSelectedSubjectId(subj.id)}
            >
              <div className="subject-card-top">
                <div
                  className="subject-icon-box"
                  style={{
                    background: `${subj.accentColor}18`,
                    color: subj.accentColor,
                    borderColor: `${subj.accentColor}35`,
                  }}
                >
                  <Icon size={26} />
                </div>
                <span className="subject-badge-code">{subj.code}</span>
              </div>

              <div className="subject-card-body">
                <h3 className="subject-card-title">{subj.title}</h3>
                <p className="subject-card-desc">{subj.description}</p>
              </div>

              <div className="subject-card-footer">
                <div className="subject-status">
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>PDF Available</span>
                </div>
                <button
                  className="btn-open-subject"
                  style={{ borderColor: subj.accentColor, color: subj.accentColor }}
                >
                  View Notes &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
