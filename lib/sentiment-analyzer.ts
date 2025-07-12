// Simple sentiment analysis using a basic word-based approach
// In production, you might want to use a more sophisticated library

const positiveWords = [
  "amazing",
  "awesome",
  "excellent",
  "fantastic",
  "great",
  "good",
  "wonderful",
  "perfect",
  "outstanding",
  "brilliant",
  "superb",
  "magnificent",
  "marvelous",
  "terrific",
  "fabulous",
  "incredible",
  "phenomenal",
  "remarkable",
  "exceptional",
  "love",
  "like",
  "enjoy",
  "happy",
  "satisfied",
  "pleased",
  "delighted",
  "impressed",
  "recommend",
  "best",
  "quality",
  "fast",
  "quick",
  "easy",
  "helpful",
  "friendly",
  "professional",
  "reliable",
  "efficient",
]

const negativeWords = [
  "awful",
  "terrible",
  "horrible",
  "bad",
  "worst",
  "hate",
  "dislike",
  "disappointed",
  "frustrated",
  "angry",
  "annoyed",
  "upset",
  "disgusted",
  "pathetic",
  "useless",
  "worthless",
  "garbage",
  "trash",
  "junk",
  "slow",
  "expensive",
  "overpriced",
  "cheap",
  "poor",
  "low",
  "broken",
  "defective",
  "faulty",
  "damaged",
  "wrong",
  "error",
  "problem",
  "issue",
  "complaint",
  "refund",
  "return",
  "cancel",
  "avoid",
  "warning",
]

export interface SentimentResult {
  label: "positive" | "neutral" | "negative"
  score: number
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().split(/\W+/)

  let positiveScore = 0
  let negativeScore = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) {
      positiveScore++
    } else if (negativeWords.includes(word)) {
      negativeScore++
    }
  })

  const totalWords = words.length
  const positiveRatio = positiveScore / totalWords
  const negativeRatio = negativeScore / totalWords

  if (positiveRatio > negativeRatio && positiveScore > 0) {
    return {
      label: "positive",
      score: Math.min(positiveRatio * 5, 1), // Normalize to 0-1
    }
  } else if (negativeRatio > positiveRatio && negativeScore > 0) {
    return {
      label: "negative",
      score: Math.min(negativeRatio * 5, 1), // Normalize to 0-1
    }
  } else {
    return {
      label: "neutral",
      score: 0.5,
    }
  }
}
