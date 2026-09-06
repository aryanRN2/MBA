import React from 'react';
import { ArrowLeft, FileText, ExternalLink, Download } from 'lucide-react';

interface NotesViewProps {
  onBackToHome: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onBackToHome }) => {
  const pdfUrl = '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf';

  return (
    <div className="notes-view-root">
      {/* Notes Top Navigation Bar */}
      <div className="notes-top-bar">
        <button className="nav-home-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="notes-brand-title">
          <FileText size={18} style={{ color: 'var(--primary)' }} />
          <span>Class Notes — Abstract Algebra (Dummit & Foote)</span>
        </div>

        {/* External Actions */}
        <div className="notes-top-actions">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="notes-action-btn"
            title="Open in new tab"
          >
            <ExternalLink size={15} />
            <span>Open in New Tab</span>
          </a>
          <a
            href={pdfUrl}
            download="Abstract_Algebra_Dummit_Foote_Monograph.pdf"
            className="notes-action-btn"
            title="Download PDF"
          >
            <Download size={15} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* PDF View Container */}
      <div className="notes-pdf-container">
        <div className="pdf-viewer-frame-wrapper">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="Notes PDF Viewer"
            className="notes-pdf-iframe"
          />
        </div>
      </div>
    </div>
  );
};
