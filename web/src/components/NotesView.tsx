import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Download,
  BookOpen,
  Eye,
} from 'lucide-react';

interface NoteDoc {
  id: string;
  title: string;
  filename: string;
  pdfUrl: string;
  size?: string;
}

interface SubjectItem {
  id: string;
  title: string;
  code: string;
  documents: NoteDoc[];
}

const SUBJECTS_LIST: SubjectItem[] = [
  {
    id: 'abstract-algebra',
    title: 'Abstract Algebra',
    code: 'MATH-AA',
    documents: [
      {
        id: 'dummit-foote-monograph',
        title: 'Abstract Algebra — Dummit & Foote Monograph',
        filename: 'Abstract_Algebra_Dummit_Foote_Monograph.pdf',
        pdfUrl: '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf',
        size: '562 KB',
      },
    ],
  },
  {
    id: 'numerical-analysis',
    title: 'Numerical Analysis',
    code: 'MATH-NA',
    documents: [],
  },
  {
    id: 'metric-spaces',
    title: 'Metric Spaces',
    code: 'MATH-MS',
    documents: [],
  },
  {
    id: 'analytical-geometry',
    title: 'Analytical Geometry',
    code: 'MATH-AG',
    documents: [],
  },
];

interface NotesViewProps {
  onBackToHome: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onBackToHome }) => {
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>('abstract-algebra');
  const [activeDoc, setActiveDoc] = useState<NoteDoc | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSubjectId(prev => (prev === id ? null : id));
  };

  // If a document is currently active/open in viewer:
  if (activeDoc) {
    return (
      <div className="notes-view-root">
        {/* Top Header */}
        <div className="notes-top-bar">
          <div className="notes-top-nav-group">
            <button className="nav-home-btn" onClick={() => setActiveDoc(null)}>
              <ArrowLeft size={16} /> Back to Notes List
            </button>
          </div>

          <div className="notes-brand-title">
            <FileText size={18} style={{ color: 'var(--primary)' }} />
            <span>{activeDoc.title}</span>
          </div>

          <div className="notes-top-actions">
            <a
              href={activeDoc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="notes-action-btn"
              title="Open in new tab"
            >
              <ExternalLink size={15} />
              <span>Open in New Tab</span>
            </a>
            <a
              href={activeDoc.pdfUrl}
              download={activeDoc.filename}
              className="notes-action-btn"
              title="Download PDF"
            >
              <Download size={15} />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF View */}
        <div className="notes-pdf-container">
          <div className="pdf-viewer-frame-wrapper">
            <iframe
              src={`${activeDoc.pdfUrl}#toolbar=1&navpanes=0`}
              title={activeDoc.title}
              className="notes-pdf-iframe"
            />
          </div>
        </div>
      </div>
    );
  }

  // Minimalist Expandable List View
  return (
    <div className="notes-view-root">
      {/* Top Header */}
      <div className="notes-top-bar">
        <button className="nav-home-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="notes-brand-title">
          <BookOpen size={18} style={{ color: 'var(--primary)' }} />
          <span>Notes & Study Materials</span>
        </div>
      </div>

      {/* Clean Minimalist Expandable List */}
      <div className="notes-list-container">
        {SUBJECTS_LIST.map(subject => {
          const isExpanded = expandedSubjectId === subject.id;
          const count = subject.documents.length;

          return (
            <div key={subject.id} className={`notes-list-item ${isExpanded ? 'expanded' : ''}`}>
              {/* Header Row (Click to Expand) */}
              <button
                className="notes-list-header-btn"
                onClick={() => toggleExpand(subject.id)}
              >
                <div className="notes-list-header-left">
                  <span className="notes-subject-title">{subject.title}</span>
                  <span className="notes-count-badge">
                    {count === 0 ? '0 contents' : count === 1 ? '1 content' : `${count} contents`}
                  </span>
                </div>

                <div className="notes-list-header-right">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Body Content */}
              {isExpanded && (
                <div className="notes-list-body">
                  {count === 0 ? (
                    <div className="notes-empty-row">
                      <span>No documents available yet for this subject.</span>
                    </div>
                  ) : (
                    <div className="notes-docs-sublist">
                      {subject.documents.map(doc => (
                        <div key={doc.id} className="note-doc-item">
                          <div className="note-doc-info">
                            <FileText size={18} className="doc-icon" />
                            <div className="doc-text">
                              <span className="doc-title">{doc.title}</span>
                              {doc.size && <span className="doc-size">{doc.size}</span>}
                            </div>
                          </div>

                          <div className="note-doc-actions">
                            <button
                              className="btn-read-doc"
                              onClick={() => setActiveDoc(doc)}
                            >
                              <Eye size={14} />
                              <span>View PDF</span>
                            </button>
                            <a
                              href={doc.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-link-doc"
                              title="Open in new tab"
                            >
                              <ExternalLink size={14} />
                            </a>
                            <a
                              href={doc.pdfUrl}
                              download={doc.filename}
                              className="btn-link-doc"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
