import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick }) => {
  return (
    <button className="k-generate-btn" onClick={onClick} aria-label="Generate Password">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      GENERATE
    </button>
  );
};
