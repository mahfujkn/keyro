import React from 'react';
import { PinConfig, AppAction } from '../../types';
import { CharacterOption } from './CharacterOption';

interface PinOptionsProps {
  config: PinConfig;
  dispatch: React.Dispatch<AppAction>;
}

export const PinOptions: React.FC<PinOptionsProps> = ({ config, dispatch }) => {
  const lengths = [4, 6, 8, 10, 12];

  return (
    <div className="k-pin-options">
      {/* PIN LENGTH SELECTOR */}
      <div className="k-option-group" style={{ margin: '8px 14px 0' }}>
        <div className="k-length-control__header" style={{ marginBottom: '4px' }}>
          <span className="k-length-control__label">PIN Length</span>
          <span className="k-length-control__value">{config.length}</span>
        </div>
        <div className="k-segmented-sub">
          {lengths.map((len) => (
            <button
              key={len}
              type="button"
              className={`k-segmented-sub__btn ${config.length === len ? 'k-segmented-sub__btn--active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PIN_LENGTH', length: len })}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      {/* TOGGLES */}
      <div className="k-char-options" style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <CharacterOption
            label="Exclude repeated digits"
            hint="e.g. 1234, no 1124"
            checked={config.excludeRepeated}
            onChange={() => dispatch({ type: 'TOGGLE_PIN_EXCLUDE_REPEATED' })}
            disabled={config.length > 10 && !config.excludeRepeated}
          />
          <CharacterOption
            label="Avoid sequential patterns"
            hint="avoid 1234, 6543"
            checked={config.avoidSequential}
            onChange={() => dispatch({ type: 'TOGGLE_PIN_AVOID_SEQUENTIAL' })}
          />
        </div>
      </div>
    </div>
  );
};
