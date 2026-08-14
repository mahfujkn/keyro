import { describe, it, expect } from 'vitest';
import { buildCharacterPool, getPoolsForConfig, LOWERCASE, UPPERCASE, DIGITS, DEFAULT_SYMBOLS } from '../src/lib/characters';
import { GeneratorConfig, DEFAULT_RANDOM_CONFIG } from '../src/types/index';

describe('characters', () => {
  it('Lowercase pool: contains all a-z', () => {
    expect(LOWERCASE).toBe('abcdefghijklmnopqrstuvwxyz');
  });

  it('Uppercase pool: contains all A-Z', () => {
    expect(UPPERCASE).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  });

  it('Digits pool: contains all 0-9', () => {
    expect(DIGITS).toBe('0123456789');
  });

  it('Default symbols: default symbol string is non-empty and contains common symbols', () => {
    expect(DEFAULT_SYMBOLS.length).toBeGreaterThan(0);
    expect(DEFAULT_SYMBOLS).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
  });

  it('Combined pool: all categories = lowercase + uppercase + digits + symbols', () => {
    const pool = buildCharacterPool(DEFAULT_RANDOM_CONFIG);
    expect(pool).toBe(LOWERCASE + UPPERCASE + DIGITS + DEFAULT_SYMBOLS);
  });

  it('Ambiguous exclusion: pool with excludeAmbiguous=true doesnt contain O, 0, I, l, 1', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, excludeAmbiguous: true };
    const pool = buildCharacterPool(config);
    expect(/[O0Il1]/.test(pool)).toBe(false);
  });

  it('Custom symbols: custom symbol string is used instead of default', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, symbols: '<>' };
    const pool = buildCharacterPool(config);
    expect(pool).toContain('<>');
    expect(pool).not.toContain('!');
  });

  it('Empty when disabled: if a category is disabled, its chars dont appear in pool', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useNumbers: false };
    const pool = buildCharacterPool(config);
    expect(/[0-9]/.test(pool)).toBe(false);
  });

  it('Required chars: getPoolsForConfig returns required chars array matching enabled categories', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useUppercase: false };
    const result = getPoolsForConfig(config);
    expect(result.requiredChars.length).toBe(3);
    expect(result.requiredChars[0]).toBe(LOWERCASE);
    expect(result.requiredChars[1]).toBe(DIGITS);
    expect(result.requiredChars[2]).toBe(DEFAULT_SYMBOLS);
  });
});
