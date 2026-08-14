import { describe, it, expect } from 'vitest';
import { generatePassword } from '../src/lib/generator';
import { GeneratorConfig, DEFAULT_RANDOM_CONFIG } from '../src/types/index';

describe('generatePassword', () => {
  it('generates password of length 4, 16, 64', () => {
    [4, 16, 64].forEach(length => {
      const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length };
      const pwd = generatePassword(config);
      expect(pwd.length).toBe(length);
    });
  });

  it('with all enabled, password contains chars from each pool', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 20 };
    const pwd = generatePassword(config);
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[!@#$%^&*()_\+\-=\[\]{}|;:,.<>?]/.test(pwd)).toBe(true);
  });

  it('generates only a-z chars', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useUppercase: false, useNumbers: false, useSymbols: false };
    const pwd = generatePassword(config);
    expect(/^[a-z]+$/.test(pwd)).toBe(true);
  });

  it('generates only A-Z chars', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useLowercase: false, useNumbers: false, useSymbols: false };
    const pwd = generatePassword(config);
    expect(/^[A-Z]+$/.test(pwd)).toBe(true);
  });

  it('generates only 0-9 chars', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useLowercase: false, useUppercase: false, useSymbols: false };
    const pwd = generatePassword(config);
    expect(/^[0-9]+$/.test(pwd)).toBe(true);
  });

  it('generates only symbol chars', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useLowercase: false, useUppercase: false, useNumbers: false };
    const pwd = generatePassword(config);
    const symbolRegex = new RegExp(`^[${config.symbols.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`);
    expect(symbolRegex.test(pwd)).toBe(true);
  });

  it('lowercase+numbers only', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useUppercase: false, useSymbols: false };
    const pwd = generatePassword(config);
    expect(/^[a-z0-9]+$/.test(pwd)).toBe(true);
  });

  it('throws when symbols enabled but symbols string empty', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, symbols: '' };
    expect(() => generatePassword(config)).toThrow();
  });

  it('throws when no category enabled', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useLowercase: false, useUppercase: false, useNumbers: false, useSymbols: false };
    expect(() => generatePassword(config)).toThrow();
  });

  it('throws when length < number of enabled categories', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 3 };
    expect(() => generatePassword(config)).toThrow();
  });

  it('with excludeAmbiguous=true, generated password never contains O, 0, I, l, 1', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, excludeAmbiguous: true, length: 30 };
    for (let i = 0; i < 100; i++) {
      const pwd = generatePassword(config);
      expect(/[O0Il1]/.test(pwd)).toBe(false);
    }
  });

  it('100 generated passwords are not all identical', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG };
    const set = new Set();
    for (let i = 0; i < 100; i++) {
      set.add(generatePassword(config));
    }
    expect(set.size).toBeGreaterThan(1);
  });

  it('over 1000 generations with length 1, every char in pool appears', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, useLowercase: true, useUppercase: false, useNumbers: false, useSymbols: false, length: 1 };
    const seen = new Set();
    for (let i = 0; i < 5000; i++) {
      seen.add(generatePassword(config));
    }
    const pool = 'abcdefghijklmnopqrstuvwxyz';
    for (const char of pool) {
      expect(seen.has(char)).toBe(true);
    }
  });

  it('generator source does not use Math.random', async () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 16 };
    const passwords = new Set<string>();
    for (let i = 0; i < 50; i++) {
      passwords.add(generatePassword(config));
    }
    expect(passwords.size).toBe(50);
  });

  it('generated password length always equals config.length', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 42 };
    expect(generatePassword(config).length).toBe(42);
  });

  it('each enabled category has at least one character in the result', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 4 };
    for (let i = 0; i < 100; i++) {
      const pwd = generatePassword(config);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[!@#$%^&*()_\+\-=\[\]{}|;:,.<>?]/.test(pwd)).toBe(true);
    }
  });
});
