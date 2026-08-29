import React, { useState } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { AppState, AppAction, GeneratorMode, RetentionMinutes, HistoryItem } from '../../types';

interface SettingsPanelProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onBack: () => void;
}

type SettingsTab = 'general' | 'history';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ state, dispatch, onBack }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const retentionOptions: { minutes: RetentionMinutes; label: string }[] = [
    { minutes: 15, label: '15m' },
    { minutes: 30, label: '30m' },
    { minutes: 60, label: '1h' },
    { minutes: 120, label: '2h' },
  ];

  const handleCopyHistoryItem = async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error('Failed to copy from history', e);
    }
  };

  const getTimeLeftStr = (expiresAt: number): string => {
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) return 'Expired';
    const diffMins = Math.ceil(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m left`;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hrs}h ${mins}m left` : `${hrs}h left`;
  };

  return (
    <div className="k-panel" style={{ overflowY: 'auto', maxHeight: '540px' }}>
      <div className="k-panel__header">
        <button className="k-icon-button" onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="k-panel__title">Settings</div>
      </div>

      {/* SETTINGS SUB-TABS WITH SPACED CONTAINER */}
      <div style={{ padding: '12px 16px 14px', borderBottom: '1px solid var(--divider)', backgroundColor: 'var(--bg)' }}>
        <div className="k-mode-selector" style={{ margin: 0 }}>
          <button
            type="button"
            className={`k-mode-selector__btn ${activeTab === 'general' ? 'k-mode-selector__btn--active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`k-mode-selector__btn ${activeTab === 'history' ? 'k-mode-selector__btn--active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Copy History {state.enableHistory && state.history.length > 0 ? `(${state.history.length})` : ''}
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div style={{ padding: '16px' }}>
        {/* TAB 1: GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* APPEARANCE */}
            <div>
              <label className="k-settings-label" style={{ marginBottom: '8px', display: 'block' }}>Appearance</label>
              <ThemeSelector theme={state.theme} onChange={(theme) => dispatch({ type: 'SET_THEME', theme })} />
            </div>

            {/* ACTIVE MODE CONFIGURATION */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--divider)' }}>
              <label className="k-settings-label" style={{ marginBottom: '8px', display: 'block' }}>
                Active Mode Configuration ({state.mode.toUpperCase()})
              </label>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {state.mode === GeneratorMode.Random && (
                  <>
                    <div><strong>Length:</strong> {state.random.length}</div>
                    <div><strong>Lowercase:</strong> {state.random.useLowercase ? 'Yes' : 'No'}</div>
                    <div><strong>Uppercase:</strong> {state.random.useUppercase ? 'Yes' : 'No'}</div>
                    <div><strong>Numbers:</strong> {state.random.useNumbers ? 'Yes' : 'No'}</div>
                    <div><strong>Symbols:</strong> {state.random.useSymbols ? 'Yes' : 'No'}</div>
                    <div><strong>Ambiguous Excluded:</strong> {state.random.excludeAmbiguous ? 'Yes' : 'No'}</div>
                  </>
                )}

                {state.mode === GeneratorMode.Passphrase && (
                  <>
                    <div><strong>Word Count:</strong> {state.passphrase.wordCount}</div>
                    <div><strong>Separator:</strong> {state.passphrase.separator === 'custom' ? state.passphrase.customSeparator : state.passphrase.separator}</div>
                    <div><strong>Capitalization:</strong> {state.passphrase.capitalization}</div>
                    <div><strong>Add Number:</strong> {state.passphrase.addNumber ? 'Yes' : 'No'}</div>
                    <div><strong>Add Symbol:</strong> {state.passphrase.addSymbol ? 'Yes' : 'No'}</div>
                  </>
                )}

                {state.mode === GeneratorMode.PIN && (
                  <>
                    <div><strong>PIN Length:</strong> {state.pin.length} digits</div>
                    <div><strong>Exclude Repeated:</strong> {state.pin.excludeRepeated ? 'Yes' : 'No'}</div>
                    <div><strong>Avoid Sequential:</strong> {state.pin.avoidSequential ? 'Yes' : 'No'}</div>
                  </>
                )}

                <div style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="k-symbol-input__reset"
                    onClick={() => dispatch({ type: 'RESET_ACTIVE_MODE' })}
                    style={{ padding: '6px 12px' }}
                  >
                    Reset {state.mode} defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COPY HISTORY SETTINGS */}
        {activeTab === 'history' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <div className="k-settings-label" style={{ marginBottom: '2px' }}>Temporary Copy History</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Auto-saves copied secrets locally</div>
              </div>
              {/* Custom Switch Component */}
              <button
                type="button"
                className={`k-switch ${state.enableHistory ? 'k-switch--active' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_ENABLE_HISTORY' })}
                role="switch"
                aria-checked={state.enableHistory}
                aria-label="Toggle temporary copy history"
              >
                <span className="k-switch__thumb" />
              </button>
            </div>

            {/* EXPLANATORY NOTICE */}
            <div className="k-history-info-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div style={{ fontSize: '11px', lineHeight: 1.4, color: 'var(--text-secondary)' }}>
                {state.enableHistory
                  ? `When enabled, copied passwords, passphrases, and PINs are saved locally in your browser for quick access. Items automatically expire and delete after ${state.retentionMinutes} minutes.`
                  : 'Feature is OFF. Copied items are never stored anywhere.'}
              </div>
            </div>

            {state.enableHistory && (
              <>
                {/* RETENTION TIME SELECTOR */}
                <div style={{ marginTop: '14px' }}>
                  <label className="k-option-group__label">Auto-Expire Retention Time</label>
                  <div className="k-segmented-sub">
                    {retentionOptions.map((opt) => (
                      <button
                        key={opt.minutes}
                        type="button"
                        className={`k-segmented-sub__btn ${state.retentionMinutes === opt.minutes ? 'k-segmented-sub__btn--active' : ''}`}
                        onClick={() => dispatch({ type: 'SET_RETENTION_MINUTES', minutes: opt.minutes })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SAVED HISTORY ITEMS */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="k-option-group__label">Saved History ({state.history.length})</span>
                    {state.history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
                        style={{ fontSize: '11px', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {state.history.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px 0', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--divider)' }}>
                      No copied items saved yet.<br />Copy a generated credential to see it here!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                      {state.history.map((item) => (
                        <div key={item.id} className="k-history-item">
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <span className="k-history-tag">{item.mode.toUpperCase()}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{getTimeLeftStr(item.expiresAt)}</span>
                            </div>
                            <span className="k-history-value">{item.value}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              className="k-history-btn"
                              onClick={() => handleCopyHistoryItem(item)}
                              title="Copy to clipboard"
                              aria-label="Copy item"
                            >
                              {copiedId === item.id ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              )}
                            </button>
                            <button
                              type="button"
                              className="k-history-btn k-history-btn--danger"
                              onClick={() => dispatch({ type: 'DELETE_HISTORY_ITEM', id: item.id })}
                              title="Delete from history"
                              aria-label="Delete item"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* FOOTER EXPLANATION WITH HIGH CONTRAST AND ALIGNED LOCK ICON */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '12px 0 0', borderTop: '1px solid var(--divider)', marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Temporary history is stored strictly on your local browser. Saved items auto-expire and are never synced or uploaded anywhere.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
