import { PinConfig, StrengthLevel, GeneratorResult } from '../types';
import { secureRandomIndex } from './generator';

const DIGITS_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Checks if a string contains sequential digits (e.g. 1234, 4321, 0123, 9876)
 */
function isSequential(pin: string): boolean {
  if (pin.length < 3) return false;

  let isAscending = true;
  let isDescending = true;
  let isRepeat = true;

  for (let i = 1; i < pin.length; i++) {
    const prev = parseInt(pin[i - 1], 10);
    const curr = parseInt(pin[i], 10);

    if (curr !== (prev + 1) % 10) isAscending = false;
    if (curr !== (prev - 1 + 10) % 10) isDescending = false;
    if (curr !== prev) isRepeat = false;
  }

  return isAscending || isDescending || isRepeat;
}

/**
 * Generates a cryptographically secure random PIN based on PinConfig.
 */
export function generatePin(config: PinConfig): GeneratorResult {
  const length = Math.max(4, Math.min(12, Math.floor(config.length || 6)));

  if (config.excludeRepeated && length > 10) {
    throw new Error('Unique digits are limited to 10.');
  }

  let pin = '';
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;
    const digits: string[] = [];
    const availableDigits = [...DIGITS_POOL];

    for (let i = 0; i < length; i++) {
      if (config.excludeRepeated) {
        const randIndex = secureRandomIndex(availableDigits.length);
        digits.push(availableDigits[randIndex]);
        availableDigits.splice(randIndex, 1);
      } else {
        const randIndex = secureRandomIndex(10);
        digits.push(DIGITS_POOL[randIndex]);
      }
    }

    const candidate = digits.join('');

    if (config.avoidSequential && isSequential(candidate)) {
      continue; // Try again
    }

    pin = candidate;
    break;
  }

  if (!pin) {
    throw new Error('Unable to generate PIN matching rules. Please relax constraints.');
  }

  // Calculate PIN entropy: log2(poolSize^length)
  const poolSize = config.excludeRepeated ? 10 : 10;
  let entropy = Math.log2(poolSize) * length;
  if (config.excludeRepeated) {
    // Permutation count P(10, length) = 10! / (10-length)!
    let perm = 1;
    for (let i = 0; i < length; i++) perm *= (10 - i);
    entropy = Math.log2(perm);
  }

  // Determine PIN strength (keep PIN strength honest: short PINs are inherently low entropy)
  let level: StrengthLevel;
  if (length <= 4) {
    level = StrengthLevel.Weak;
  } else if (length <= 6) {
    level = StrengthLevel.Fair;
  } else if (length <= 8) {
    level = StrengthLevel.Strong;
  } else {
    level = StrengthLevel.VeryStrong;
  }

  return {
    password: pin,
    strength: level,
    entropy: Math.round(entropy * 10) / 10,
  };
}
