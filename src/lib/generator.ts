import { GeneratorConfig, GeneratorMode, GeneratorResult, AppState } from '../types';
import { getPoolsForConfig } from './characters';
import { generatePassphrase } from './passphrase';
import { generatePin } from './pin';
import { calculateStrength } from './strength';

/**
 * Returns an unbiased random index in [0, max) using Web Crypto rejection sampling.
 * Supports any max pool size up to 4,294,967,296.
 */
export function secureRandomIndex(max: number): number {
  if (max <= 0) throw new Error("Max must be greater than 0");

  if (max <= 256) {
    const array = new Uint8Array(1);
    const limit = Math.floor(256 / max) * max;
    while (true) {
      crypto.getRandomValues(array);
      if (array[0] < limit) {
        return array[0] % max;
      }
    }
  } else if (max <= 65536) {
    const array = new Uint16Array(1);
    const limit = Math.floor(65536 / max) * max;
    while (true) {
      crypto.getRandomValues(array);
      if (array[0] < limit) {
        return array[0] % max;
      }
    }
  } else {
    const array = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;
    while (true) {
      crypto.getRandomValues(array);
      if (array[0] < limit) {
        return array[0] % max;
      }
    }
  }
}

/**
 * Generates a Random Password.
 */
export function generatePassword(config: GeneratorConfig): string {
  const { pool, requiredChars } = getPoolsForConfig(config);

  if (requiredChars.length === 0) {
    throw new Error('At least one character category must be enabled.');
  }

  if (config.useSymbols && config.symbols.length === 0) {
    throw new Error('Symbols category is enabled but symbols string is empty.');
  }

  if (config.length < requiredChars.length) {
    throw new Error(`Password length must be at least ${requiredChars.length} to satisfy required categories.`);
  }

  if (pool.length === 0) {
    throw new Error('Character pool is empty.');
  }

  const passwordChars: string[] = [];

  // Guarantee at least one character from each enabled category
  for (const requiredPool of requiredChars) {
    const randomIndex = secureRandomIndex(requiredPool.length);
    passwordChars.push(requiredPool[randomIndex]);
  }

  // Fill remaining positions
  const remainingLength = config.length - requiredChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = secureRandomIndex(pool.length);
    passwordChars.push(pool[randomIndex]);
  }

  // Fisher-Yates shuffle
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}

/**
 * Master secret generator function that dispatches based on active mode in AppState.
 */
export function generateSecret(state: AppState): GeneratorResult {
  switch (state.mode) {
    case GeneratorMode.Passphrase: {
      const symbolPool = state.random.symbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';
      return generatePassphrase(state.passphrase, symbolPool);
    }
    case GeneratorMode.PIN: {
      return generatePin(state.pin);
    }
    case GeneratorMode.Random:
    default: {
      const pwd = generatePassword(state.random);
      const str = calculateStrength(pwd, state.random);
      return {
        password: pwd,
        strength: str.level,
        entropy: str.entropy,
      };
    }
  }
}
