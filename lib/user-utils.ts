const adjectives = [
  "Anonymous",
  "Honest",
  "Truthful",
  "Genuine",
  "Candid",
  "Frank",
  "Direct",
  "Sincere",
  "Real",
  "Authentic",
  "Transparent",
  "Open",
  "Straight",
  "Plain",
  "Clear",
  "Bold",
  "Brave",
  "Fair",
  "Just",
  "Wise",
  "Smart",
  "Clever",
]

const nouns = [
  "Reviewer",
  "Voice",
  "Opinion",
  "Critic",
  "Judge",
  "Observer",
  "Witness",
  "User",
  "Customer",
  "Buyer",
  "Consumer",
  "Client",
  "Person",
  "Individual",
  "Member",
  "Participant",
  "Contributor",
  "Evaluator",
  "Assessor",
  "Analyst",
]

export function generatePseudonym(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1
  return `${adjective}${noun}${number}`
}

export function generateAvatar(pseudonym: string): string {
  return pseudonym?.charAt(0).toUpperCase() || "A"
}

