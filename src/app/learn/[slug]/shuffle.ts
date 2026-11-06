import type { Question } from "@/lessons/lessons";

// Authors tend to write the right option first, so the page shows a
// question's options in a shuffled order. The order is seeded by the Lesson's
// Slug and the question's id, and worked out on the server, so it's the same
// on every visit and every reload, and the same in the HTML as after
// hydration. Options keep their ids (a–f), so the answer key never changes.

// FNV-1a: a string's 32-bit hash, as the generator's seed.
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: a small seeded generator of numbers in [0, 1).
function generator(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A Fisher–Yates shuffle driven by the seed: the same seed always gives the
// same order. The input is left as it was.
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const next = generator(hash(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function withShuffledOptions(question: Question, slug: string): Question {
  return { ...question, options: shuffled(question.options, `${slug}/${question.id}`) };
}
