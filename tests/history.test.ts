import { describe, it, expect } from 'vitest';
import { filterExpiredHistory } from '../src/lib/storage';
import { HistoryItem, GeneratorMode } from '../src/types';

describe('Temporary Copy History', () => {
  it('correctly filters out expired items', () => {
    const now = Date.now();
    const items: HistoryItem[] = [
      {
        id: '1',
        value: 'validPassword123',
        mode: GeneratorMode.Random,
        timestamp: now,
        expiresAt: now + 30 * 60 * 1000, // Valid
      },
      {
        id: '2',
        value: 'expiredSecret',
        mode: GeneratorMode.PIN,
        timestamp: now - 60 * 60 * 1000,
        expiresAt: now - 5 * 60 * 1000, // Expired
      },
    ];

    const valid = filterExpiredHistory(items);
    expect(valid.length).toBe(1);
    expect(valid[0].id).toBe('1');
    expect(valid[0].value).toBe('validPassword123');
  });

  it('filters out non-string or corrupted items (e.g. SyntheticEvents)', () => {
    const now = Date.now();
    const items: any[] = [
      {
        id: '1',
        value: 'validPassword123',
        mode: GeneratorMode.Random,
        timestamp: now,
        expiresAt: now + 30 * 60 * 1000,
      },
      {
        id: '2',
        value: { _reactName: 'onClick', target: {} }, // Corrupted event object
        mode: GeneratorMode.Random,
        timestamp: now,
        expiresAt: now + 30 * 60 * 1000,
      },
    ];

    const valid = filterExpiredHistory(items);
    expect(valid.length).toBe(1);
    expect(valid[0].value).toBe('validPassword123');
  });

  it('handles empty or undefined history gracefully', () => {
    expect(filterExpiredHistory(undefined)).toEqual([]);
    expect(filterExpiredHistory([])).toEqual([]);
  });
});
