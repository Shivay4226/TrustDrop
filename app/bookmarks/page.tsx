"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ArrowLeft, Bookmark } from "lucide-react"
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

export default function BookmarksPage() {
  const [bookmarkedReviews, setBookmarkedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarkedReviews()
  }, [])

  const fetchBookmarkedReviews = async () => {
    try {
      const bookmarkIds = localStorage.getItem("trustdrop_bookmarks")
      if (!bookmarkIds) {
        setLoading(false)
        return
      }

      const ids = JSON.parse(bookmarkIds)
      if (ids.length === 0) {
        setLoading(false)
        return
      }

      const response = await fetch("/api/reviews/bookmarked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      })

      const data = await response.json()
      setBookmarkedReviews(data)
    } catch (error) {
      console.error("Error fetching bookmarked reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = (reviewId: string) => {
    const bookmarks = localStorage.getItem("trustdrop_bookmarks")
    if (bookmarks) {
      const ids = JSON.parse(bookmarks)
      const newIds = ids.filter((id: string) => id !== reviewId)
      localStorage.setItem("trustdrop_bookmarks", JSON.stringify(newIds))
      setBookmarkedReviews((prev) => prev.filter((review) => review._id !== reviewId))
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
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Your Bookmarks</h1>
            <p className="text-muted-foreground">Reviews you've saved for later</p>
          </div>
        </div>

        <div className="space-y-6">
          {bookmarkedReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-4">Start bookmarking reviews to save them for later</p>
                <Link href="/explore">
                  <Button>Explore Reviews</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            bookmarkedReviews.map((review) => (
              <Card key={review._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
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
                    <Button variant="ghost" size="icon" onClick={() => removeBookmark(review._id)}>
                      <Bookmark className="w-4 h-4 fill-current text-primary" />
                    </Button>
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
                      {review.hashtags.map((tag) => (
                        <Link key={tag} href={`/tag/${tag.slice(1)}`}>
                          <Badge
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                          >
                            {tag}
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
