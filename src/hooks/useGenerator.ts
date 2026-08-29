import { useEffect, useReducer, useCallback } from 'react';
import {
  AppState,
  AppAction,
  DEFAULTS,
  UserPreferences,
  GeneratorMode,
  DEFAULT_RANDOM_CONFIG,
  DEFAULT_PASSPHRASE_CONFIG,
  DEFAULT_PIN_CONFIG,
  HistoryItem,
} from '../types';
import { generateSecret } from '../lib/generator';
import { calculateStrength } from '../lib/strength';
import { loadPreferences, savePreferences, filterExpiredHistory } from '../lib/storage';

function countEnabledRandomCategories(state: AppState): number {
  return [
    state.random.useLowercase,
    state.random.useUppercase,
    state.random.useNumbers,
    state.random.useSymbols,
  ].filter(Boolean).length;
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode, validationError: null };

    case 'SET_PASSWORD':
      return { ...state, password: action.password };

    // ---- RANDOM MODE ACTIONS ----
    case 'SET_LENGTH':
      return {
        ...state,
        random: { ...state.random, length: action.length },
      };
    case 'TOGGLE_LOWERCASE': {
      if (state.random.useLowercase && countEnabledRandomCategories(state) === 1) {
        return { ...state, validationError: 'At least one category must be enabled' };
      }
      return {
        ...state,
        random: { ...state.random, useLowercase: !state.random.useLowercase },
        validationError: null,
      };
    }
    case 'TOGGLE_UPPERCASE': {
      if (state.random.useUppercase && countEnabledRandomCategories(state) === 1) {
        return { ...state, validationError: 'At least one category must be enabled' };
      }
      return {
        ...state,
        random: { ...state.random, useUppercase: !state.random.useUppercase },
        validationError: null,
      };
    }
    case 'TOGGLE_NUMBERS': {
      if (state.random.useNumbers && countEnabledRandomCategories(state) === 1) {
        return { ...state, validationError: 'At least one category must be enabled' };
      }
      return {
        ...state,
        random: { ...state.random, useNumbers: !state.random.useNumbers },
        validationError: null,
      };
    }
    case 'TOGGLE_SYMBOLS': {
      if (state.random.useSymbols && countEnabledRandomCategories(state) === 1) {
        return { ...state, validationError: 'At least one category must be enabled' };
      }
      return {
        ...state,
        random: { ...state.random, useSymbols: !state.random.useSymbols },
        validationError: null,
      };
    }
    case 'SET_SYMBOLS':
      return {
        ...state,
        random: { ...state.random, symbols: action.symbols },
      };
    case 'TOGGLE_EXCLUDE_AMBIGUOUS':
      return {
        ...state,
        random: { ...state.random, excludeAmbiguous: !state.random.excludeAmbiguous },
      };

    // ---- PASSPHRASE MODE ACTIONS ----
    case 'SET_PASSPHRASE_WORD_COUNT':
      return {
        ...state,
        passphrase: { ...state.passphrase, wordCount: action.wordCount },
      };
    case 'SET_PASSPHRASE_SEPARATOR':
      return {
        ...state,
        passphrase: { ...state.passphrase, separator: action.separator },
      };
    case 'SET_PASSPHRASE_CUSTOM_SEPARATOR':
      return {
        ...state,
        passphrase: { ...state.passphrase, customSeparator: action.customSeparator },
      };
    case 'SET_PASSPHRASE_CAPITALIZATION':
      return {
        ...state,
        passphrase: { ...state.passphrase, capitalization: action.capitalization },
      };
    case 'TOGGLE_PASSPHRASE_ADD_NUMBER':
      return {
        ...state,
        passphrase: { ...state.passphrase, addNumber: !state.passphrase.addNumber },
      };
    case 'TOGGLE_PASSPHRASE_ADD_SYMBOL':
      return {
        ...state,
        passphrase: { ...state.passphrase, addSymbol: !state.passphrase.addSymbol },
      };
    case 'TOGGLE_PASSPHRASE_EXCLUDE_AMBIGUOUS':
      return {
        ...state,
        passphrase: { ...state.passphrase, excludeAmbiguous: !state.passphrase.excludeAmbiguous },
      };

    // ---- PIN MODE ACTIONS ----
    case 'SET_PIN_LENGTH':
      return {
        ...state,
        pin: { ...state.pin, length: action.length },
      };
    case 'TOGGLE_PIN_EXCLUDE_REPEATED':
      return {
        ...state,
        pin: { ...state.pin, excludeRepeated: !state.pin.excludeRepeated },
      };
    case 'TOGGLE_PIN_AVOID_SEQUENTIAL':
      return {
        ...state,
        pin: { ...state.pin, avoidSequential: !state.pin.avoidSequential },
      };

    // ---- HISTORY ACTIONS ----
    case 'TOGGLE_ENABLE_HISTORY': {
      const nextEnable = !state.enableHistory;
      const nextHistory = nextEnable ? state.history : [];
      savePreferences({ enableHistory: nextEnable, history: nextHistory });
      return { ...state, enableHistory: nextEnable, history: nextHistory };
    }
    case 'SET_RETENTION_MINUTES': {
      savePreferences({ retentionMinutes: action.minutes });
      return { ...state, retentionMinutes: action.minutes };
    }
    case 'ADD_HISTORY_ITEM': {
      const filtered = filterExpiredHistory([action.item, ...state.history]);
      // Keep max 50 items
      const pruned = filtered.slice(0, 50);
      savePreferences({ history: pruned });
      return { ...state, history: pruned };
    }
    case 'DELETE_HISTORY_ITEM': {
      const updated = state.history.filter(h => h.id !== action.id);
      savePreferences({ history: updated });
      return { ...state, history: updated };
    }
    case 'CLEAR_HISTORY': {
      savePreferences({ history: [] });
      return { ...state, history: [] };
    }
    case 'PRUNE_EXPIRED_HISTORY': {
      const pruned = filterExpiredHistory(state.history);
      savePreferences({ history: pruned });
      return { ...state, history: pruned };
    }

    // ---- SHARED ACTIONS ----
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_COPY_STATUS':
      return { ...state, copyStatus: action.status };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SET_VALIDATION_ERROR':
      return { ...state, validationError: action.error };
    case 'SET_STRENGTH':
      return { ...state, strength: action.strength };

    case 'RESET_ACTIVE_MODE': {
      if (state.mode === GeneratorMode.Passphrase) {
        return {
          ...state,
          passphrase: { ...DEFAULT_PASSPHRASE_CONFIG },
          validationError: null,
        };
      } else if (state.mode === GeneratorMode.PIN) {
        return {
          ...state,
          pin: { ...DEFAULT_PIN_CONFIG },
          validationError: null,
        };
      } else {
        return {
          ...state,
          random: { ...DEFAULT_RANDOM_CONFIG },
          validationError: null,
        };
      }
    }

    case 'RESET_ALL':
      return {
        ...state,
        mode: DEFAULTS.mode,
        random: { ...DEFAULT_RANDOM_CONFIG },
        passphrase: { ...DEFAULT_PASSPHRASE_CONFIG },
        pin: { ...DEFAULT_PIN_CONFIG },
        theme: DEFAULTS.theme,
        enableHistory: DEFAULTS.enableHistory,
        retentionMinutes: DEFAULTS.retentionMinutes,
        history: [],
        validationError: null,
      };

    case 'LOAD_PREFERENCES':
      return {
        ...state,
        theme: action.prefs.theme ?? state.theme,
        mode: action.prefs.mode ?? state.mode,
        random: { ...state.random, ...action.prefs.random },
        passphrase: { ...state.passphrase, ...action.prefs.passphrase },
        pin: { ...state.pin, ...action.prefs.pin },
        enableHistory: action.prefs.enableHistory ?? state.enableHistory,
        retentionMinutes: action.prefs.retentionMinutes ?? state.retentionMinutes,
        history: filterExpiredHistory(action.prefs.history ?? []),
      };

    default:
      return state;
  }
}

const initialState: AppState = {
  mode: DEFAULTS.mode,
  password: '',
  random: { ...DEFAULT_RANDOM_CONFIG },
  passphrase: { ...DEFAULT_PASSPHRASE_CONFIG },
  pin: { ...DEFAULT_PIN_CONFIG },
  theme: DEFAULTS.theme,
  copyStatus: 'idle',
  view: 'generator',
  validationError: null,
  strength: { level: 'Weak' as any, entropy: 0, score: 0 },
  enableHistory: DEFAULTS.enableHistory,
  retentionMinutes: DEFAULTS.retentionMinutes,
  history: [],
};

export function useGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generate = useCallback(() => {
    try {
      if (state.mode === GeneratorMode.Random && state.random.useSymbols && state.random.symbols.length === 0) {
        dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Symbols cannot be empty' });
        return;
      }

      if (state.mode === GeneratorMode.PIN && state.pin.excludeRepeated && state.pin.length > 10) {
        dispatch({ type: 'SET_VALIDATION_ERROR', error: 'Unique digits are limited to 10.' });
        return;
      }

      const res = generateSecret(state);
      const str = calculateStrength(res.password, state.random);

      const finalStrength = state.mode === GeneratorMode.Random ? str : {
        level: res.strength,
        entropy: res.entropy,
        score: Math.min(res.entropy / (state.mode === GeneratorMode.PIN ? 64 : 128), 1.0),
      };

      dispatch({ type: 'SET_PASSWORD', password: res.password });
      dispatch({ type: 'SET_STRENGTH', strength: finalStrength });
      dispatch({ type: 'SET_VALIDATION_ERROR', error: null });

      const prefs: Partial<UserPreferences> = {
        theme: state.theme,
        mode: state.mode,
        random: state.random,
        passphrase: state.passphrase,
        pin: state.pin,
        enableHistory: state.enableHistory,
        retentionMinutes: state.retentionMinutes,
      };
      savePreferences(prefs);
    } catch (err: any) {
      dispatch({ type: 'SET_VALIDATION_ERROR', error: err.message || 'Generation failed' });
    }
  }, [
    state.mode,
    state.random,
    state.passphrase,
    state.pin,
    state.theme,
    state.enableHistory,
    state.retentionMinutes,
  ]);

  // Initial load
  useEffect(() => {
    loadPreferences().then((prefs) => {
      dispatch({ type: 'LOAD_PREFERENCES', prefs });
    });
  }, []);

  // Prune expired history on interval
  useEffect(() => {
    if (!state.enableHistory) return;
    const interval = setInterval(() => {
      dispatch({ type: 'PRUNE_EXPIRED_HISTORY' });
    }, 30000);
    return () => clearInterval(interval);
  }, [state.enableHistory]);

  // Auto-generate on mount and whenever mode or mode options change
  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = useCallback(async (customText?: string | unknown, modeOverride?: GeneratorMode) => {
    // CRITICAL BUGFIX: In React button onClick={copyToClipboard}, customText receives SyntheticEvent object!
    // We MUST verify customText is strictly a string, otherwise fallback to state.password!
    const validCustomText = (typeof customText === 'string' && customText) ? customText : undefined;
    const textToCopy = validCustomText ?? state.password;
    if (!textToCopy || typeof textToCopy !== 'string') return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      dispatch({ type: 'SET_COPY_STATUS', status: 'copied' });

      // Save to temporary history if enabled
      if (state.enableHistory) {
        const item: HistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          value: textToCopy,
          mode: modeOverride ?? state.mode,
          timestamp: Date.now(),
          expiresAt: Date.now() + state.retentionMinutes * 60 * 1000,
        };
        dispatch({ type: 'ADD_HISTORY_ITEM', item });
      }

      setTimeout(() => {
        dispatch({ type: 'SET_COPY_STATUS', status: 'idle' });
      }, 2000);
    } catch (e) {
      dispatch({ type: 'SET_COPY_STATUS', status: 'error' });
      setTimeout(() => {
        dispatch({ type: 'SET_COPY_STATUS', status: 'idle' });
      }, 2000);
    }
  }, [state.password, state.mode, state.enableHistory, state.retentionMinutes]);

  return { state, dispatch, generate, copyToClipboard };
}
