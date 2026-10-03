/**
 * High-performance Arabic normalization & similarity matching engine
 */

export class ArabicNormalizer {
  private static readonly DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u0640]/g;

  /**
   * Cleans and normalizes Arabic text for relaxed comparison.
   */
  public static normalize(text: string): string {
    if (!text) return '';

    return text
      .trim()
      .toLowerCase()
      // Remove diacritics / Tashkeel and Tatweel
      .replace(this.DIACRITICS_REGEX, '')
      // Normalize Hamzas to bare Alef
      .replace(/[أإآء]/g, 'ا')
      // Normalize Taa Marbouta to Haa
      .replace(/ة/g, 'ه')
      // Normalize Alef Maqsoura to Yaa
      .replace(/ى/g, 'ي')
      // Normalize Persian/Urdu variants
      .replace(/ك/g, 'ك')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      // Clean multiple spaces and non-word characters
      .replace(/[-_.,'"`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalizes for alias searching, optionally stripping 'ال' if it begins a word.
   */
  public static stripAl(text: string): string {
    const norm = this.normalize(text);
    return norm.replace(/^ال/, '').trim();
  }

  /**
   * Levenshtein Distance for typo tolerance
   */
  public static distance(a: string, b: string): number {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;

    const matrix: number[][] = [];
    for (let i = 0; i <= bn; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= an; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bn; i++) {
      for (let j = 1; j <= an; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[bn][an];
  }

  /**
   * Normalized similarity metric [0.0 - 1.0]
   */
  public static similarity(a: string, b: string): number {
    const na = this.normalize(a);
    const nb = this.normalize(b);
    if (na === nb) return 1.0;
    const maxLen = Math.max(na.length, nb.length);
    if (maxLen === 0) return 1.0;
    const dist = this.distance(na, nb);
    return Math.max(0, 1.0 - dist / maxLen);
  }
}
