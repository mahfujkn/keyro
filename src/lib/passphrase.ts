import { PassphraseConfig, StrengthLevel, GeneratorResult, AMBIGUOUS_CHARS } from '../types';
import { EFF_SHORT_WORDLIST } from './wordlist';
import { secureRandomIndex } from './generator';

/**
 * Returns a cryptographically secure random index in [0, max)
 * using rejection sampling.
 */
function secureRandomNumber(min: number, max: number): number {
  const range = max - min + 1;
  const index = secureRandomIndex(range);
  return min + index;
}

/**
 * Capitalizes the first letter of a string.
 */
function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Randomly capitalizes letters in a word using Web Crypto randomness.
 */
function randomCapitalizeWord(word: string): string {
  return word.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const isUpper = secureRandomIndex(2) === 1;
      return isUpper ? char.toUpperCase() : char.toLowerCase();
    }
    return char;
  }).join('');
}

/**
 * Generates a secure random passphrase based on PassphraseConfig.
 */
export function generatePassphrase(config: PassphraseConfig, symbolPool: string = '!@#$%^&*()_+-=[]{}|;:,.<>?'): GeneratorResult {
  const wordCount = Math.max(3, Math.min(10, Math.floor(config.wordCount || 5)));
  
  // Filter wordlist if ambiguous character exclusion is requested
  let activeWordlist = EFF_SHORT_WORDLIST;
  if (config.excludeAmbiguous) {
    const filtered = EFF_SHORT_WORDLIST.filter(word => {
      for (const char of word) {
        if (AMBIGUOUS_CHARS.has(char)) return false;
      }
      return true;
    });
    if (filtered.length >= 100) {
      activeWordlist = filtered;
    }
  }

  const selectedWords: string[] = [];
  const listSize = activeWordlist.length;

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = secureRandomIndex(listSize);
    let word = activeWordlist[randomIndex];

    // Apply capitalization
    switch (config.capitalization) {
      case 'lowercase':
        word = word.toLowerCase();
        break;
      case 'capitalize':
        word = capitalizeWord(word);
        break;
      case 'random':
        word = randomCapitalizeWord(word);
        break;
      default:
        word = capitalizeWord(word);
        break;
    }

    selectedWords.push(word);
  }

  // Determine separator string
  let separatorChar = config.separator;
  if (config.separator === 'custom') {
    separatorChar = config.customSeparator ?? '-';
  }

  let passphrase = selectedWords.join(separatorChar);

  let additionalEntropy = 0;

  // Append secure number if enabled (e.g. 10..99 or unambiguous digits 2..9)
  if (config.addNumber) {
    let numStr = '';
    if (config.excludeAmbiguous) {
      const unambiguousDigits = ['2', '3', '4', '5', '6', '7', '8', '9'];
      const d1 = unambiguousDigits[secureRandomIndex(unambiguousDigits.length)];
      const d2 = unambiguousDigits[secureRandomIndex(unambiguousDigits.length)];
      numStr = `${d1}${d2}`;
      additionalEntropy += Math.log2(64);
    } else {
      const num = secureRandomNumber(10, 99);
      numStr = `${num}`;
      additionalEntropy += Math.log2(90);
    }
    passphrase += separatorChar + numStr;
  }

  // Append secure symbol if enabled
  if (config.addSymbol && symbolPool && symbolPool.length > 0) {
    let activeSymbols = symbolPool;
    if (config.excludeAmbiguous) {
      activeSymbols = symbolPool.split('').filter(s => !AMBIGUOUS_CHARS.has(s)).join('');
    }
    if (activeSymbols.length > 0) {
      const symIndex = secureRandomIndex(activeSymbols.length);
      const sym = activeSymbols[symIndex];
      passphrase += sym;
      additionalEntropy += Math.log2(activeSymbols.length);
    }
  }

  // Calculate entropy: log2(wordlistSize^wordCount) + additional bits
  const wordEntropy = Math.log2(listSize) * wordCount;
  const totalEntropy = wordEntropy + additionalEntropy;

  // Determine strength level
  let level: StrengthLevel;
  if (totalEntropy < 40) {
    level = StrengthLevel.Weak;
  } else if (totalEntropy < 60) {
    level = StrengthLevel.Fair;
  } else if (totalEntropy < 80) {
    level = StrengthLevel.Strong;
  } else {
    level = StrengthLevel.VeryStrong;
  }

  return {
    password: passphrase,
    strength: level,
    entropy: Math.round(totalEntropy * 10) / 10,
  };
}
