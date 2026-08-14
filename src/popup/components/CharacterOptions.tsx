import React from 'react';
import { CharacterOption } from './CharacterOption';
import { AppAction } from '../../types';

interface CharacterOptionsProps {
  state: {
    useLowercase: boolean;
    useUppercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
    excludeAmbiguous: boolean;
  };
  dispatch: React.Dispatch<AppAction>;
}

export const CharacterOptions: React.FC<CharacterOptionsProps> = ({ state, dispatch }) => {
  const enabledCount = [
    state.useLowercase,
    state.useUppercase,
    state.useNumbers,
    state.useSymbols,
  ].filter(Boolean).length;

  const handleToggle = (
    value: boolean,
    actionType: 'TOGGLE_LOWERCASE' | 'TOGGLE_UPPERCASE' | 'TOGGLE_NUMBERS' | 'TOGGLE_SYMBOLS'
  ) => {
    if (value && enabledCount === 1) {
      dispatch({
        type: 'SET_VALIDATION_ERROR',
        error: 'You must select at least one character type',
      });
      setTimeout(() => {
        dispatch({ type: 'SET_VALIDATION_ERROR', error: null });
      }, 3000);
      return;
    }
    dispatch({ type: actionType });
  };

  return (
    <>
      <div className="k-char-options">
        <div className="k-char-options__grid">
          <CharacterOption
            label="Lowercase"
            hint="a-z"
            checked={state.useLowercase}
            onChange={() => handleToggle(state.useLowercase, 'TOGGLE_LOWERCASE')}
            disabled={state.useLowercase && enabledCount === 1}
          />
          <CharacterOption
            label="Uppercase"
            hint="A-Z"
            checked={state.useUppercase}
            onChange={() => handleToggle(state.useUppercase, 'TOGGLE_UPPERCASE')}
            disabled={state.useUppercase && enabledCount === 1}
          />
          <CharacterOption
            label="Numbers"
            hint="0-9"
            checked={state.useNumbers}
            onChange={() => handleToggle(state.useNumbers, 'TOGGLE_NUMBERS')}
            disabled={state.useNumbers && enabledCount === 1}
          />
          <CharacterOption
            label="Symbols"
            hint="!@#$"
            checked={state.useSymbols}
            onChange={() => handleToggle(state.useSymbols, 'TOGGLE_SYMBOLS')}
            disabled={state.useSymbols && enabledCount === 1}
          />
        </div>
      </div>
      <div className="k-ambiguous-toggle">
        <CharacterOption
          label="Exclude ambiguous characters"
          hint="e.g. l, I, O, 0"
          checked={state.excludeAmbiguous}
          onChange={() => dispatch({ type: 'TOGGLE_EXCLUDE_AMBIGUOUS' })}
        />
      </div>
    </>
  );
};
