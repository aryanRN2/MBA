import React, { useState } from 'react';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface AuthGateProps {
  onLoginSuccess: (userId: string) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = passcode.trim();
    if (!trimmed) {
      setError('Please enter the access passcode.');
      return;
    }

    if (trimmed.toUpperCase() !== 'MMV') {
      setError('Incorrect passcode. Please try again.');
      return;
    }

    const authData = {
      userId: 'Anushka',
      isAuthenticated: true,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem('anushka_portal_auth', JSON.stringify(authData));
    onLoginSuccess('Anushka');
  };

  return (
    <div className="auth-gateway-overlay">
      <div className="auth-minimal-box">
        <h1 className="auth-minimal-title">Anushka Portal</h1>

        {error && (
          <div className="auth-error-banner animate-shake">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-minimal-form">
          <div className="auth-minimal-input-wrapper">
            <Lock size={18} className="auth-field-icon" />
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              className="auth-minimal-input"
            />
          </div>

          <button type="submit" className="auth-minimal-btn">
            <span>Enter</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
