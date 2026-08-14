import React from 'react';
import { CopyStatus } from '../../types';

interface PasswordDisplayProps {
  password: string;
  copyStatus: CopyStatus;
  onCopy: () => void;
  onRegenerate: () => void;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({
  password,
  copyStatus,
  onCopy,
  onRegenerate,
}) => {
  const isCopied = copyStatus === 'copied';

  return (
    <div className="k-password-display">
      <span className="k-password-display__text">{password}</span>
      <div className="k-password-display__actions">
        <button
          className="k-password-display__action"
          onClick={onRegenerate}
          aria-label="Generate new password"
          title="Regenerate"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
        <button
          className={`k-password-display__action ${isCopied ? 'k-password-display__action--success' : ''}`}
          onClick={onCopy}
          aria-label={isCopied ? 'Copied' : 'Copy password'}
          title="Copy"
          aria-live="polite"
        >
          {isCopied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
