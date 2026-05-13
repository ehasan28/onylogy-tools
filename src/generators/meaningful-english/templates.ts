/**
 * Sentence templates using slot tokens:
 *   [DET]      singular determiner
 *   [DETP]     plural determiner
 *   [N]        noun (singular treated)
 *   [ADJ]      adjective
 *   [V]        past-tense verb
 *   [ADV]      adverb
 *   [PREP]     preposition
 *   [CONJ]     conjunction
 *   [OPENER]   sentence opener (capitalized)
 */
export const SENTENCE_TEMPLATES: string[] = [
  "[DET] [ADJ] [N] [V] [DET] [N].",
  "[DET] [N] [V] [ADV].",
  "[DET] [ADJ] [N] [V] [PREP] [DET] [N].",
  "[DET] [N] [V] [DET] [ADJ] [N] [PREP] [DET] [N].",
  "[DET] [ADJ] [N] [CONJ] [DET] [N] [V] [ADV].",
  "[OPENER], [DET] [N] [V] [DET] [ADJ] [N].",
  "[DET] [N] [V] [DET] [N] [CONJ] [V] [DET] [ADJ] [N].",
  "[PREP] [DET] [ADJ] [N], [DET] [N] [V] [ADV].",
  "[DET] [N] [CONJ] [DET] [N] [V] [DET] [N].",
  "[OPENER], [DET] [ADJ] [N] [V] [DET] [N].",
  "[DET] [N] [V] [DET] [N] [PREP] [DET] [ADJ] [N].",
  "[DET] [ADJ] [ADJ] [N] [V] [DET] [N].",
  "[DET] [N] [V] [ADV] [PREP] [DET] [ADJ] [N].",
  "[CONJ] [DET] [N] [V] [DET] [N], [DET] [ADJ] [N] [V] [ADV].",
  "[DET] [N] [V] [DET] [ADJ] [N], [CONJ] [DET] [N] [V] [ADV].",
  "[OPENER], [DET] [N] [V] [DET] [N] [PREP] [DET] [ADJ] [N].",
  "[DET] [ADJ] [N] [V] [ADV], [CONJ] [DET] [N] [V] [DET] [N].",
  "[DET] [N] [V] [DET] [ADJ] [N] [CONJ] [V] [ADV].",
];
