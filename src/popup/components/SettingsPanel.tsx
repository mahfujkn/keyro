import React from 'react';
import { ThemeSelector } from './ThemeSelector';
import { AppState, AppAction, GeneratorMode } from '../../types';

interface SettingsPanelProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onBack: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ state, dispatch, onBack }) => {
  return (
    <div className="k-panel">
      <div className="k-panel__header">
        <button className="k-icon-button" onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="k-panel__title">Settings</div>
      </div>

      <div className="k-settings-section">
        <label className="k-settings-label">Appearance</label>
        <ThemeSelector theme={state.theme} onChange={(theme) => dispatch({ type: 'SET_THEME', theme })} />
      </div>

      <div className="k-settings-section">
        <label className="k-settings-label">Active Mode Configuration ({state.mode.toUpperCase()})</label>
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
  );
};
