import { describe, it, expect } from 'vitest';
import { generatePin } from '../src/lib/pin';
import { DEFAULT_PIN_CONFIG } from '../src/types';

describe('PinGenerator', () => {
  it('generates PIN of length 4, 6, 8, 10, 12 consisting only of digits', () => {
    [4, 6, 8, 10, 12].forEach(length => {
      const res = generatePin({ ...DEFAULT_PIN_CONFIG, length });
      expect(res.password.length).toBe(length);
      expect(res.password).toMatch(/^\d+$/);
    });
  });

  it('enforces unique digits when excludeRepeated is true', () => {
    for (let i = 0; i < 50; i++) {
      const res = generatePin({ ...DEFAULT_PIN_CONFIG, length: 6, excludeRepeated: true });
      const digits = res.password.split('');
      const unique = new Set(digits);
      expect(unique.size).toBe(6);
    }
  });

  it('throws validation error when excludeRepeated is true and length > 10', () => {
    expect(() => {
      generatePin({ ...DEFAULT_PIN_CONFIG, length: 12, excludeRepeated: true });
    }).toThrow('Unique digits are limited to 10.');
  });

  it('rejects simple sequential patterns when avoidSequential is true', () => {
    for (let i = 0; i < 50; i++) {
      const res = generatePin({ ...DEFAULT_PIN_CONFIG, length: 4, avoidSequential: true });
      expect(res.password).not.toBe('1234');
      expect(res.password).not.toBe('4321');
      expect(res.password).not.toBe('1111');
    }
  });

  it('calculates honest strength levels for short PINs vs long PINs', () => {
    const pin4 = generatePin({ ...DEFAULT_PIN_CONFIG, length: 4 });
    const pin12 = generatePin({ ...DEFAULT_PIN_CONFIG, length: 12 });
    expect(pin4.strength).toBe('Weak');
    expect(pin12.strength).toBe('Very Strong');
    expect(pin12.entropy).toBeGreaterThan(pin4.entropy);
  });
});
