import React from 'react';

export const PrivacyBadge: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = 'https://github.com/mahfujkn';
    if (typeof chrome !== 'undefined' && chrome?.tabs?.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="k-privacy-badge" style={{ flexDirection: 'column', gap: '3px', padding: '8px 14px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Passwords generated locally
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
        Developed with ❤️ by{' '}
        <a
          href="https://github.com/mahfujkn"
          onClick={handleLinkClick}
          style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Mahfuj Khan Rafsan
        </a>
      </div>
    </div>
  );
};
