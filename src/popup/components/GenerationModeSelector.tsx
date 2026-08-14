import React from 'react';
import { GeneratorMode } from '../../types';

interface GenerationModeSelectorProps {
  mode: GeneratorMode;
  onChange: (mode: GeneratorMode) => void;
}

export const GenerationModeSelector: React.FC<GenerationModeSelectorProps> = ({ mode, onChange }) => {
  const modes = [
    { key: GeneratorMode.Random, label: 'Random' },
    { key: GeneratorMode.Passphrase, label: 'Passphrase' },
    { key: GeneratorMode.PIN, label: 'PIN' },
  ];

  return (
    <div className="k-mode-selector" role="radiogroup" aria-label="Generation mode">
      {modes.map((m) => {
        const isActive = mode === m.key;
        return (
          <button
            key={m.key}
            type="button"
            className={`k-mode-selector__btn ${isActive ? 'k-mode-selector__btn--active' : ''}`}
            onClick={() => onChange(m.key)}
            role="radio"
            aria-checked={isActive}
            aria-label={`${m.label} mode`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};
