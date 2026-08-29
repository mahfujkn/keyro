import React from 'react';

interface AboutPanelProps {
  onBack: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ onBack }) => {
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
    <div className="k-panel">
      <div className="k-panel__header">
        <button className="k-icon-button" onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="k-panel__title">About Keyro V2.0</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0 16px' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '12px' }}>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="var(--primary)" opacity="0.2"/>
          <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8C10.8954 8 10 8.89543 10 10C10 10.7403 10.4022 11.3866 11 11.7324V15H13V11.7324C13.5978 11.3866 14 10.7403 14 10C14 8.89543 13.1046 8 12 8Z" fill="var(--primary)"/>
        </svg>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>Keyro v2.0.0</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Passwords • Passphrases • PINs • Temporary History</div>
      </div>

      <div className="k-settings-section">
        <label className="k-settings-label">Privacy First</label>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
          Your generated credentials never leave your device.
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.9 }}>
          {[
            'Random passwords, Passphrases & PINs',
            'Optional local temporary copy history',
            'No accounts, login or cloud dependencies',
            'No tracking, analytics or telemetry',
            'Bundled EFF public domain wordlist',
            '100% offline local Web Crypto generation'
          ].map((item) => (
            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', padding: '16px 0 8px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
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
