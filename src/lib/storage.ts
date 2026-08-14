import { UserPreferences, DEFAULTS } from '../types';

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set(prefs, () => {
          resolve();
        });
      });
    } else if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('keyro_prefs');
      const parsed = existing ? JSON.parse(existing) : {};
      const updated = { ...parsed, ...prefs };
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
    } else if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('keyro_prefs');
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.theme) prefs.theme = parsed.theme;
        if (parsed.mode) prefs.mode = parsed.mode;
        if (parsed.random) prefs.random = { ...prefs.random, ...parsed.random };
        if (parsed.passphrase) prefs.passphrase = { ...prefs.passphrase, ...parsed.passphrase };
        if (parsed.pin) prefs.pin = { ...prefs.pin, ...parsed.pin };
      }
    }
  } catch (e) {
    console.warn('Storage load error:', e);
  }

  return prefs;
}
