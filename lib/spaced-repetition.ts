// SM-2 Spaced Repetition Algorithm
// Quality: 0 = complete blackout, 5 = perfect response

export interface ReviewState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export function calculateNextReview(
  quality: number, // 0-5
  current: ReviewState
): ReviewState {
  // Clamp quality
  const q = Math.max(0, Math.min(5, quality));

  let { easeFactor, intervalDays, repetitions } = current;

  if (q < 3) {
    // Failed — reset
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  return { easeFactor, intervalDays, repetitions };
}

export function qualityFromRating(
  rating: "forgot" | "hard" | "good" | "easy"
): number {
  const map = { forgot: 1, hard: 3, good: 4, easy: 5 };
  return map[rating];
}
