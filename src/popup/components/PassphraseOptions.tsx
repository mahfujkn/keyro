import React from 'react';
import { PassphraseConfig, PassphraseCapitalization, AppAction } from '../../types';
import { CharacterOption } from './CharacterOption';

interface PassphraseOptionsProps {
  config: PassphraseConfig;
  dispatch: React.Dispatch<AppAction>;
}

export const PassphraseOptions: React.FC<PassphraseOptionsProps> = ({ config, dispatch }) => {
  const minWords = 3;
  const maxWords = 10;

  const handleMinusWords = () => {
    if (config.wordCount > minWords) {
      dispatch({ type: 'SET_PASSPHRASE_WORD_COUNT', wordCount: config.wordCount - 1 });
    }
  };

  const handlePlusWords = () => {
    if (config.wordCount < maxWords) {
      dispatch({ type: 'SET_PASSPHRASE_WORD_COUNT', wordCount: config.wordCount + 1 });
    }
  };

  const fillPercent = ((config.wordCount - minWords) / (maxWords - minWords)) * 100;

  const separators = [
    { key: '-', label: 'Hyphen (-)' },
    { key: ' ', label: 'Space' },
    { key: '_', label: 'Underscore (_)' },
    { key: '.', label: 'Dot (.)' },
    { key: 'custom', label: 'Custom' },
  ];

  const capsOptions: { key: PassphraseCapitalization; label: string }[] = [
    { key: 'capitalize', label: 'Capitalize' },
    { key: 'lowercase', label: 'Lowercase' },
    { key: 'random', label: 'Random' },
  ];

  return (
    <div className="k-passphrase-options">
      {/* WORD COUNT CONTROL */}
      <div className="k-length-control" style={{ marginTop: '8px' }}>
        <div className="k-length-control__header">
          <span className="k-length-control__label">Word Count</span>
          <span className="k-length-control__value">{config.wordCount}</span>
        </div>
        <div className="k-length-control__row">
          <button
            type="button"
            className="k-length-control__btn"
            onClick={handleMinusWords}
            disabled={config.wordCount <= minWords}
            aria-label="Decrease word count"
            title="Decrease"
          >
            −
          </button>
          <input
            type="range"
            className="k-length-control__slider"
            min={minWords}
            max={maxWords}
            step="1"
            value={config.wordCount}
            onChange={(e) =>
              dispatch({ type: 'SET_PASSPHRASE_WORD_COUNT', wordCount: Number(e.target.value) })
            }
            aria-label="Word count slider"
            aria-valuetext={`${config.wordCount} words`}
            style={{ '--slider-fill': `${fillPercent}%` } as React.CSSProperties}
          />
          <button
            type="button"
            className="k-length-control__btn"
            onClick={handlePlusWords}
            disabled={config.wordCount >= maxWords}
            aria-label="Increase word count"
            title="Increase"
          >
            +
          </button>
        </div>
      </div>

      {/* SEPARATOR SELECTOR */}
      <div className="k-option-group" style={{ margin: '8px 14px 0' }}>
        <label className="k-option-group__label">Separator</label>
        <div className="k-segmented-sub">
          {separators.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`k-segmented-sub__btn ${config.separator === s.key ? 'k-segmented-sub__btn--active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PASSPHRASE_SEPARATOR', separator: s.key })}
            >
              {s.label}
            </button>
          ))}
        </div>
        {config.separator === 'custom' && (
          <input
            type="text"
            className="k-symbol-input__field"
            style={{ marginTop: '6px', width: '100%' }}
            value={config.customSeparator}
            onChange={(e) =>
              dispatch({ type: 'SET_PASSPHRASE_CUSTOM_SEPARATOR', customSeparator: e.target.value })
            }
            placeholder="Custom separator (e.g. /)"
            maxLength={5}
            aria-label="Custom separator"
          />
        )}
      </div>

      {/* CAPITALIZATION SELECTOR */}
      <div className="k-option-group" style={{ margin: '8px 14px 0' }}>
        <label className="k-option-group__label">Capitalization</label>
        <div className="k-segmented-sub">
          {capsOptions.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`k-segmented-sub__btn ${config.capitalization === c.key ? 'k-segmented-sub__btn--active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PASSPHRASE_CAPITALIZATION', capitalization: c.key })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOGGLES */}
      <div className="k-char-options" style={{ marginTop: '8px' }}>
        <div className="k-char-options__grid">
          <CharacterOption
            label="Add number"
            hint="e.g. -82"
            checked={config.addNumber}
            onChange={() => dispatch({ type: 'TOGGLE_PASSPHRASE_ADD_NUMBER' })}
          />
          <CharacterOption
            label="Add symbol"
            hint="e.g. !"
            checked={config.addSymbol}
            onChange={() => dispatch({ type: 'TOGGLE_PASSPHRASE_ADD_SYMBOL' })}
          />
        </div>
      </div>
      <div className="k-ambiguous-toggle" style={{ marginTop: '4px' }}>
        <CharacterOption
          label="Exclude ambiguous characters"
          hint="l, I, O, 0"
          checked={config.excludeAmbiguous}
          onChange={() => dispatch({ type: 'TOGGLE_PASSPHRASE_EXCLUDE_AMBIGUOUS' })}
        />
      </div>
    </div>
  );
};
