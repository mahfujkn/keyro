import { describe, it, expect } from 'vitest';
import { calculateStrength } from '../src/lib/strength';
import { GeneratorConfig, StrengthLevel, DEFAULT_RANDOM_CONFIG } from '../src/types/index';

describe('calculateStrength', () => {
  it('Weak password: length 4, only lowercase -> Weak', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 4, useUppercase: false, useNumbers: false, useSymbols: false };
    const result = calculateStrength('aaaa', config);
    expect(result.level).toBe(StrengthLevel.Weak);
  });

  it('Fair password: length 8, lowercase+uppercase -> Fair', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 8, useNumbers: false, useSymbols: false };
    const result = calculateStrength('aAaAaAaA', config);
    expect(result.level).toBe(StrengthLevel.Fair);
  });

  it('Strong password: length 12, all categories -> Strong', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 12 };
    const result = calculateStrength('aA1!aA1!aA1!', config);
    expect(result.level).toBe(StrengthLevel.Strong);
  });

  it('Very strong password: length 20, all categories -> VeryStrong', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 20 };
    const result = calculateStrength('aA1!aA1!aA1!aA1!aA1!', config);
    expect(result.level).toBe(StrengthLevel.VeryStrong);
  });

  it('score is always between 0 and 1', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 4 };
    const r1 = calculateStrength('aA1!', config);
    expect(r1.score).toBeGreaterThanOrEqual(0);
    expect(r1.score).toBeLessThanOrEqual(1);

    const config2: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 100 };
    const r2 = calculateStrength('aA1!'.repeat(25), config2);
    expect(r2.score).toBeGreaterThanOrEqual(0);
    expect(r2.score).toBeLessThanOrEqual(1);
  });

  it('longer password = higher entropy', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 8 };
    const r1 = calculateStrength('aA1!aA1!', config);
    const r2 = calculateStrength('aA1!aA1!aA1!', { ...config, length: 12 });
    expect(r2.entropy).toBeGreaterThan(r1.entropy);
  });

  it('more categories = higher entropy at same length', () => {
    const config1: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 8, useNumbers: false, useSymbols: false };
    const r1 = calculateStrength('aAaAaAaA', config1);
    
    const config2: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 8 };
    const r2 = calculateStrength('aA1!aA1!', config2);
    expect(r2.entropy).toBeGreaterThan(r1.entropy);
  });

  it('length 4, single category -> positive entropy', () => {
    const config: GeneratorConfig = { ...DEFAULT_RANDOM_CONFIG, length: 4, useUppercase: false, useNumbers: false, useSymbols: false };
    const r = calculateStrength('aaaa', config);
    expect(r.entropy).toBeGreaterThan(0);
  });
});
