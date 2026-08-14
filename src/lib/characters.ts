import { AMBIGUOUS_CHARS, GeneratorConfig } from '../types';

export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function filterAmbiguous(pool: string): string {
  return pool.split('').filter(char => !AMBIGUOUS_CHARS.has(char)).join('');
}

export function buildCharacterPool(config: GeneratorConfig): string {
  let pool = '';
  if (config.useLowercase) pool += LOWERCASE;
  if (config.useUppercase) pool += UPPERCASE;
  if (config.useNumbers) pool += DIGITS;
  if (config.useSymbols) pool += config.symbols;

  if (config.excludeAmbiguous) {
    pool = filterAmbiguous(pool);
  }

  return pool;
}

export function getPoolsForConfig(config: GeneratorConfig): { pool: string; requiredChars: string[] } {
  let combinedPool = '';
  const requiredChars: string[] = [];

  const addPool = (basePool: string) => {
    let pool = basePool;
    if (config.excludeAmbiguous) {
      pool = filterAmbiguous(pool);
    }
    if (pool.length > 0) {
      combinedPool += pool;
      requiredChars.push(pool);
    }
  };

  if (config.useLowercase) addPool(LOWERCASE);
  if (config.useUppercase) addPool(UPPERCASE);
  if (config.useNumbers) addPool(DIGITS);
  if (config.useSymbols) addPool(config.symbols);

  return { pool: combinedPool, requiredChars };
}
