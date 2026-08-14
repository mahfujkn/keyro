import React from 'react';
import { useGenerator } from '../hooks/useGenerator';
import { useTheme } from '../hooks/useTheme';
import { GeneratorMode } from '../types';
import { Header } from './components/Header';
import { GenerationModeSelector } from './components/GenerationModeSelector';
import { PasswordDisplay } from './components/PasswordDisplay';
import { StrengthIndicator } from './components/StrengthIndicator';
import { LengthControl } from './components/LengthControl';
import { CharacterOptions } from './components/CharacterOptions';
import { PassphraseOptions } from './components/PassphraseOptions';
import { PinOptions } from './components/PinOptions';
import { SymbolInput } from './components/SymbolInput';
import { GenerateButton } from './components/GenerateButton';
import { PrivacyBadge } from './components/PrivacyBadge';
import { SettingsPanel } from './components/SettingsPanel';
import { AboutPanel } from './components/AboutPanel';

const App: React.FC = () => {
  const { state, dispatch, generate, copyToClipboard } = useGenerator();

  useTheme(state.theme);

  const handleSettingsClick = () => dispatch({ type: 'SET_VIEW', view: 'settings' });
  const handleAboutClick = () => dispatch({ type: 'SET_VIEW', view: 'about' });
  const handleBack = () => dispatch({ type: 'SET_VIEW', view: 'generator' });

  const handleReset = () => {
    dispatch({ type: 'RESET_ACTIVE_MODE' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Settings Panel Overlay */}
      {state.view === 'settings' && (
        <SettingsPanel state={state} dispatch={dispatch} onBack={handleBack} />
      )}

      {/* About Panel Overlay */}
      {state.view === 'about' && (
        <AboutPanel onBack={handleBack} />
      )}

      {/* Main Generator View */}
      <div style={{ display: state.view === 'generator' ? 'block' : 'none' }}>
        <Header onSettingsClick={handleSettingsClick} onAboutClick={handleAboutClick} />

        <GenerationModeSelector
          mode={state.mode}
          onChange={(mode) => dispatch({ type: 'SET_MODE', mode })}
        />

        <PasswordDisplay
          password={state.password}
          copyStatus={state.copyStatus}
          onCopy={copyToClipboard}
          onRegenerate={generate}
        />

        <StrengthIndicator strength={state.strength} />

        {/* MODE-SPECIFIC CONTROLS */}
        {state.mode === GeneratorMode.Random && (
          <>
            <LengthControl
              length={state.random.length}
              onChange={(length) => dispatch({ type: 'SET_LENGTH', length })}
            />

            <CharacterOptions state={state.random} dispatch={dispatch} />

            {state.random.useSymbols && (
              <SymbolInput
                symbols={state.random.symbols}
                onSymbolsChange={(symbols) => dispatch({ type: 'SET_SYMBOLS', symbols })}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {state.mode === GeneratorMode.Passphrase && (
          <PassphraseOptions config={state.passphrase} dispatch={dispatch} />
        )}

        {state.mode === GeneratorMode.PIN && (
          <PinOptions config={state.pin} dispatch={dispatch} />
        )}

        {/* VALIDATION ERROR DISPLAY */}
        {state.validationError && (
          <div className="k-validation-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {state.validationError}
          </div>
        )}

        {/* GENERATE BUTTON */}
        <GenerateButton onClick={generate} />

        {/* PRIVACY BADGE */}
        <PrivacyBadge />
      </div>
    </div>
  );
};

export default App;
