"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Bookmark, ArrowLeft, Heart } from "lucide-react"
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
  sentimentScore: number
  createdAt: string
  reactions: number
}

export default function ExplorePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
    loadBookmarks()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, searchTerm, ratingFilter, sentimentFilter])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadBookmarks = () => {
    if (typeof window !== "undefined") {
      const bookmarks = localStorage.getItem("trustdrop_bookmarks")
      setBookmarkedIds(bookmarks ? JSON.parse(bookmarks) : [])
    }
  }

  const toggleBookmark = (reviewId: string) => {
    const newBookmarks = bookmarkedIds.includes(reviewId)
      ? bookmarkedIds.filter((id) => id !== reviewId)
      : [...bookmarkedIds, reviewId]

    setBookmarkedIds(newBookmarks)
    localStorage.setItem("trustdrop_bookmarks", JSON.stringify(newBookmarks))
  }

  const filterReviews = () => {
    let filtered = reviews

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.hashtags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((review) => review.rating >= Number.parseInt(ratingFilter))
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter((review) => review.sentiment === sentimentFilter)
    }

    setFilteredReviews(filtered)
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
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Explore Reviews</h1>
            <p className="text-muted-foreground">Discover authentic experiences from the community</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reviews, hashtags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No reviews found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
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
                    <Button variant="ghost" size="icon" onClick={() => toggleBookmark(review._id)}>
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedIds.includes(review._id) ? "fill-current text-primary" : "text-muted-foreground"
                        }`}
                      />
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
                    <div className="flex flex-wrap gap-2 mb-4">
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{review.reactions || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
