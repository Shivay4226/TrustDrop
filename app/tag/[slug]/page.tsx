"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ArrowLeft, Hash } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { HashtagParser } from "@/components/hashtag-parser"

interface Review {
  _id: string
  title: string
  content: string
  rating: number
  pseudonym: string
  avatar: string
  hashtags: string[]
  sentiment: string
  createdAt: string
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const tag = `#${params.slug}`

  useEffect(() => {
    fetchTagReviews()
  }, [params.slug])

  const fetchTagReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/tag/${params.slug}`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching tag reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "default"
      case "negative":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/explore">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">{params.slug}</h1>
            </div>
            <p className="text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""} tagged with {tag}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground mb-4">No reviews have been tagged with {tag} yet.</p>
                <Link href="/write-review">
                  <Button>Write the First Review</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <CardDescription>
                        by {review.pseudonym} • {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant={getSentimentColor(review.sentiment)}>{review.sentiment}</Badge>
                  </div>

                  <div className="mb-4">
                    <HashtagParser text={review.content} />
                  </div>

                  {review.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.hashtags.map((hashtag) => (
                        <Link key={hashtag} href={`/tag/${hashtag.slice(1)}`}>
                          <Badge
                            variant={hashtag === tag ? "default" : "outline"}
                            className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                          >
                            {hashtag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
