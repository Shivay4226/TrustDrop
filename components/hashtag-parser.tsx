import Link from "next/link"

interface HashtagParserProps {
  text: string
}

export function HashtagParser({ text }: HashtagParserProps) {
  const parseText = (text: string) => {
    const parts = text.split(/(#\w+)/g)

    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        const tag = part.slice(1)
        return (
          <Link key={index} href={`/tag/${tag}`} className="text-primary hover:underline font-medium">
            {part}
          </Link>
        )
      }
      return part
    })
  }

  return <div className="whitespace-pre-wrap">{parseText(text)}</div>
}
