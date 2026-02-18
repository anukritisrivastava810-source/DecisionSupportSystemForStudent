/**
 * Calculates the weighted score for a single option.
 * Time is inverted: lower time required = higher score.
 */
export function calculateScore(option, weights) {
  const { interest, career, time } = option;
  const { interestWeight, careerWeight, timeWeight } = weights;

  return (
    interest * interestWeight +
    career * careerWeight +
    (10 - time) * timeWeight
  );
}

/**
 * Evaluates and ranks all options by their weighted scores.
 * Returns a new array sorted in descending order with rank and score.
 */
export function evaluateOptions(options, weights) {
  if (!options || options.length === 0) return [];

  return options
    .map((option) => ({
      ...option,
      score: parseFloat(calculateScore(option, weights).toFixed(2)),
    }))
    .sort((a, b) => b.score - a.score)
    .map((option, index) => ({
      ...option,
      rank: index + 1,
    }));
}
