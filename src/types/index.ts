// ============================================================
// Keyro V1.5 — Shared Type Definitions
// ============================================================

/** Supported generator modes */
export enum GeneratorMode {
  Random = 'random',
  Passphrase = 'passphrase',
  PIN = 'pin',
}

/** Strength levels for generated credentials */
export enum StrengthLevel {
  Weak = 'Weak',
  Fair = 'Fair',
  Strong = 'Strong',
  VeryStrong = 'Very Strong',
}

/** Theme options */
export type Theme = 'dark' | 'light' | 'system';

/** Copy button status */
export type CopyStatus = 'idle' | 'copied' | 'error';

/** Popup view state */
export type ViewState = 'generator' | 'settings' | 'about';

/** Configuration for Random Password mode */
export interface GeneratorConfig {
  length: number;
  useLowercase: boolean;
  useUppercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  symbols: string;
  excludeAmbiguous: boolean;
  mode: GeneratorMode;
}

/** Capitalization choices for Passphrase mode */
export type PassphraseCapitalization = 'lowercase' | 'capitalize' | 'random';

/** Configuration for Passphrase mode */
export interface PassphraseConfig {
  wordCount: number;
  separator: string;
  customSeparator: string;
  capitalization: PassphraseCapitalization;
  addNumber: boolean;
  addSymbol: boolean;
  excludeAmbiguous: boolean;
}

/** Configuration for PIN mode */
export interface PinConfig {
  length: number;
  excludeRepeated: boolean;
  avoidSequential: boolean;
}

/** Result from any generator mode */
export interface GeneratorResult {
  password: string;
  strength: StrengthLevel;
  entropy: number;
}

/** Strength calculation result */
export interface StrengthResult {
  level: StrengthLevel;
  entropy: number;
  /** 0-1 normalized score for the strength bar */
  score: number;
}

/** User preferences stored in chrome.storage.local */
export interface UserPreferences {
  theme: Theme;
  mode: GeneratorMode;
  random: {
    length: number;
    useLowercase: boolean;
    useUppercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
    symbols: string;
    excludeAmbiguous: boolean;
  };
  passphrase: {
    wordCount: number;
    separator: string;
    customSeparator: string;
    capitalization: PassphraseCapitalization;
    addNumber: boolean;
    addSymbol: boolean;
    excludeAmbiguous: boolean;
  };
  pin: {
    length: number;
    excludeRepeated: boolean;
    avoidSequential: boolean;
  };
}

/** Full application state */
export interface AppState {
  mode: GeneratorMode;
  password: string;
  random: GeneratorConfig;
  passphrase: PassphraseConfig;
  pin: PinConfig;
  theme: Theme;
  copyStatus: CopyStatus;
  view: ViewState;
  validationError: string | null;
  strength: StrengthResult;
}

/** Actions for the state reducer */
export type AppAction =
  | { type: 'SET_MODE'; mode: GeneratorMode }
  | { type: 'SET_PASSWORD'; password: string }
  // Random mode actions
  | { type: 'SET_LENGTH'; length: number }
  | { type: 'TOGGLE_LOWERCASE' }
  | { type: 'TOGGLE_UPPERCASE' }
  | { type: 'TOGGLE_NUMBERS' }
  | { type: 'TOGGLE_SYMBOLS' }
  | { type: 'SET_SYMBOLS'; symbols: string }
  | { type: 'TOGGLE_EXCLUDE_AMBIGUOUS' }
  // Passphrase mode actions
  | { type: 'SET_PASSPHRASE_WORD_COUNT'; wordCount: number }
  | { type: 'SET_PASSPHRASE_SEPARATOR'; separator: string }
  | { type: 'SET_PASSPHRASE_CUSTOM_SEPARATOR'; customSeparator: string }
  | { type: 'SET_PASSPHRASE_CAPITALIZATION'; capitalization: PassphraseCapitalization }
  | { type: 'TOGGLE_PASSPHRASE_ADD_NUMBER' }
  | { type: 'TOGGLE_PASSPHRASE_ADD_SYMBOL' }
  | { type: 'TOGGLE_PASSPHRASE_EXCLUDE_AMBIGUOUS' }
  // PIN mode actions
  | { type: 'SET_PIN_LENGTH'; length: number }
  | { type: 'TOGGLE_PIN_EXCLUDE_REPEATED' }
  | { type: 'TOGGLE_PIN_AVOID_SEQUENTIAL' }
  // Shared actions
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_COPY_STATUS'; status: CopyStatus }
  | { type: 'SET_VIEW'; view: ViewState }
  | { type: 'SET_VALIDATION_ERROR'; error: string | null }
  | { type: 'SET_STRENGTH'; strength: StrengthResult }
  | { type: 'RESET_ACTIVE_MODE' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_PREFERENCES'; prefs: UserPreferences };

/** Default configuration values for V1.5 */
export const DEFAULT_RANDOM_CONFIG: Readonly<GeneratorConfig> = {
  length: 16,
  useLowercase: true,
  useUppercase: true,
  useNumbers: true,
  useSymbols: true,
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  excludeAmbiguous: false,
  mode: GeneratorMode.Random,
};

export const DEFAULT_PASSPHRASE_CONFIG: Readonly<PassphraseConfig> = {
  wordCount: 5,
  separator: '-',
  customSeparator: '-',
  capitalization: 'capitalize',
  addNumber: true,
  addSymbol: false,
  excludeAmbiguous: false,
};

export const DEFAULT_PIN_CONFIG: Readonly<PinConfig> = {
  length: 6,
  excludeRepeated: false,
  avoidSequential: false,
};

export const DEFAULTS = {
  theme: 'dark' as Theme,
  mode: GeneratorMode.Random,
  random: DEFAULT_RANDOM_CONFIG,
  passphrase: DEFAULT_PASSPHRASE_CONFIG,
  pin: DEFAULT_PIN_CONFIG,
};

/** Characters considered visually ambiguous */
export const AMBIGUOUS_CHARS = new Set(['O', '0', 'I', 'l', '1']);
