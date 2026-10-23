// Quiz limits, shared by the API and the Checkpoint and Final test components.
// Kept apart from quiz.ts so the browser can import them without database code.

// A Final test passes at this percentage or more (4 of 5 is exactly 80).
export const PASS_PERCENT = 80;

// The longest request body the quiz endpoints read, in characters (413 above it).
export const MAX_REQUEST_CHARS = 4096;

// Below this many Answers, the page says "You're one of the first to answer"
// instead of showing percentages.
export const MIN_CROWD = 5;

// The pass rule runs here, never in the database, so changing PASS_PERCENT
// never leaves stale data behind.
export function passed(score: number, total: number): boolean {
  return total > 0 && score * 100 >= total * PASS_PERCENT;
}
