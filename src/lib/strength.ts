import { GeneratorConfig, StrengthLevel, StrengthResult } from '../types';
import { buildCharacterPool } from './characters';

export function calculateStrength(password: string, config: GeneratorConfig): StrengthResult {
  const pool = buildCharacterPool(config);
  const poolSize = pool.length;

  if (poolSize === 0 || password.length === 0) {
    return { level: StrengthLevel.Weak, entropy: 0, score: 0 };
  }

  const entropy = Math.log2(poolSize) * password.length;

  let level: StrengthLevel;
  if (entropy < 40) {
    level = StrengthLevel.Weak;
  } else if (entropy < 60) {
    level = StrengthLevel.Fair;
  } else if (entropy < 80) {
    level = StrengthLevel.Strong;
  } else {
    level = StrengthLevel.VeryStrong;
  }

  // Cap score at 128 bits = 1.0 for the bar
  const maxBits = 128;
  const score = Math.min(entropy / maxBits, 1.0);

  return { level, entropy, score };
}
