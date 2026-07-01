export type Locale = 'en' | 'es' | 'pt';

export type TranslationDict = {
  siteTitle: string;
  siteTagline: string;
  home: string;
  language: string;
  allRightsReserved: string;
  // Tools
  anagramSolver: string;
  wordUnscrambler: string;
  charCounter: string;
  // Anagram
  enterLetters: string;
  findAnagrams: string;
  anagramsFound: string;
  noAnagrams: string;
  sortBy: string;
  length: string;
  alphabetically: string;
  // Word Unscramble
  scrambleLetters: string;
  unscramble: string;
  possibleWords: string;
  // Char Counter
  typeText: string;
  characters: string;
  words: string;
  lines: string;
  withoutSpaces: string;
  readingTime: string;
  topChars: string;
  copyResult: string;
};
