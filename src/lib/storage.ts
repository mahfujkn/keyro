import { UserPreferences, DEFAULTS, HistoryItem } from '../types';

export function filterExpiredHistory(history?: HistoryItem[]): HistoryItem[] {
  if (!Array.isArray(history)) return [];
  const now = Date.now();
  return history.filter(item => item && typeof item.value === 'string' && item.expiresAt > now);
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  try {
    const toSave = { ...prefs };
    if (toSave.history) {
      toSave.history = filterExpiredHistory(toSave.history);
    }

    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set(toSave, () => {
          resolve();
        });
      });
    } else if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('keyro_prefs');
      const parsed = existing ? JSON.parse(existing) : {};
      const updated = { ...parsed, ...toSave };
      localStorage.setItem('keyro_prefs', JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

export async function loadPreferences(): Promise<UserPreferences> {
  const prefs: UserPreferences = {
    theme: DEFAULTS.theme,
    mode: DEFAULTS.mode,
    random: { ...DEFAULTS.random },
    passphrase: { ...DEFAULTS.passphrase },
    pin: { ...DEFAULTS.pin },
    enableHistory: DEFAULTS.enableHistory,
    retentionMinutes: DEFAULTS.retentionMinutes,
    history: [],
  };

  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      const result = await new Promise<Record<string, any>>((resolve) => {
        chrome.storage.local.get(null, (items) => {
          if (typeof chrome !== 'undefined' && chrome.runtime?.lastError) {
            resolve({});
          } else {
            resolve(items || {});
          }
        });
      });

      if (result.theme) prefs.theme = result.theme;
      if (result.mode) prefs.mode = result.mode;
      if (result.random) prefs.random = { ...prefs.random, ...result.random };
      if (result.passphrase) prefs.passphrase = { ...prefs.passphrase, ...result.passphrase };
      if (result.pin) prefs.pin = { ...prefs.pin, ...result.pin };
      if (typeof result.enableHistory === 'boolean') prefs.enableHistory = result.enableHistory;
      if (result.retentionMinutes) prefs.retentionMinutes = result.retentionMinutes;
      if (Array.isArray(result.history)) prefs.history = filterExpiredHistory(result.history);
    } else if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('keyro_prefs');
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.theme) prefs.theme = parsed.theme;
        if (parsed.mode) prefs.mode = parsed.mode;
        if (parsed.random) prefs.random = { ...prefs.random, ...parsed.random };
        if (parsed.passphrase) prefs.passphrase = { ...prefs.passphrase, ...parsed.passphrase };
        if (parsed.pin) prefs.pin = { ...prefs.pin, ...parsed.pin };
        if (typeof parsed.enableHistory === 'boolean') prefs.enableHistory = parsed.enableHistory;
        if (parsed.retentionMinutes) prefs.retentionMinutes = parsed.retentionMinutes;
        if (Array.isArray(parsed.history)) prefs.history = filterExpiredHistory(parsed.history);
      }
    }
  } catch (e) {
    console.warn('Storage load error:', e);
  }

  return prefs;
}
