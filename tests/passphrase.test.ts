import { describe, it, expect } from 'vitest';
import { generatePassphrase } from '../src/lib/passphrase';
import { DEFAULT_PASSPHRASE_CONFIG } from '../src/types';

describe('PassphraseGenerator', () => {
  it('generates passphrase with default 5 words separated by hyphens', () => {
    const res = generatePassphrase(DEFAULT_PASSPHRASE_CONFIG);
    expect(res.password).toBeDefined();
    // Default config has addNumber: true, so parts count should be 6 (5 words + 1 number)
    const parts = res.password.split('-');
    expect(parts.length).toBe(6);
    expect(res.entropy).toBeGreaterThan(50);
  });

  it('respects word count boundaries (3 to 10)', () => {
    const res3 = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, wordCount: 3, addNumber: false });
    expect(res3.password.split('-').length).toBe(3);

    const res10 = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, wordCount: 10, addNumber: false });
    expect(res10.password.split('-').length).toBe(10);
  });

  it('supports space, underscore, dot, and custom separators', () => {
    const resSpace = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, separator: ' ', addNumber: false });
    expect(resSpace.password.split(' ').length).toBe(5);

    const resUnderscore = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, separator: '_', addNumber: false });
    expect(resUnderscore.password.split('_').length).toBe(5);

    const resDot = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, separator: '.', addNumber: false });
    expect(resDot.password.split('.').length).toBe(5);

    const resCustom = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, separator: 'custom', customSeparator: '/', addNumber: false });
    expect(resCustom.password.split('/').length).toBe(5);
  });

  it('handles lowercase, capitalize, and random capitalizations', () => {
    const resLower = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, capitalization: 'lowercase', addNumber: false });
    expect(resLower.password).toBe(resLower.password.toLowerCase());

    const resCap = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, capitalization: 'capitalize', addNumber: false });
    const words = resCap.password.split('-');
    words.forEach(word => {
      expect(word[0]).toBe(word[0].toUpperCase());
    });
  });

  it('appends number when addNumber is true', () => {
    const res = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, addNumber: true });
    const lastPart = res.password.split('-').pop();
    expect(lastPart).toMatch(/^\d+$/);
  });

  it('appends symbol when addSymbol is true', () => {
    const res = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, addSymbol: true, addNumber: false });
    const lastChar = res.password.slice(-1);
    expect('!@#$%^&*()_+-=[]{}|;:,.<>?').toContain(lastChar);
  });

  it('filters ambiguous characters when excludeAmbiguous is true', () => {
    for (let i = 0; i < 50; i++) {
      const res = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, excludeAmbiguous: true });
      expect(res.password).not.toMatch(/[lI1O0]/);
    }
  });

  it('calculates higher entropy for more words', () => {
    const res3 = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, wordCount: 3, addNumber: false });
    const res8 = generatePassphrase({ ...DEFAULT_PASSPHRASE_CONFIG, wordCount: 8, addNumber: false });
    expect(res8.entropy).toBeGreaterThan(res3.entropy);
  });
});
