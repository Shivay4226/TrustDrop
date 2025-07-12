export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#\w+/g
  const matches = text.match(hashtagRegex)
  return matches ? [...new Set(matches)] : []
}
