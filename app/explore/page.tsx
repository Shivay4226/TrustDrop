"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Star,
  Search,
  Bookmark,
  ArrowLeft,
  Heart,
  Rows,
  LayoutGrid,
  LayoutPanelTop,
  Grid3x3,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { HashtagParser } from "@/components/hashtag-parser"
import { ReviewTable } from "@/components/ReviewTable"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import Image from "next/image"

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
  companyName?: string
  companyUrl?: string
  productName?: string
  productUrl?: string
  images?: { url: string }[]
}

export default function ExplorePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"card" | "grid">("card")
  const [cardColumns, setCardColumns] = useState<"1" | "2" | "4">("1")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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
          review.hashtags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating >= Number.parseInt(ratingFilter)
      )
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.sentiment === sentimentFilter
      )
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
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Explore Reviews</h1>
                <p className="text-muted-foreground">
                  Discover authentic experiences from the community
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "card" ? "default" : "outline"}
                  onClick={() => setViewMode("card")}
                >
                  <Rows className="w-4 h-4 mr-1" /> Card View
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4 mr-1" /> Table View
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Toggle Group */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reviews, hashtags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
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
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-4 mb-6 flex-wrap">
          {viewMode === "card" && (
            <ToggleGroup
              variant="outline"
              type="single"
              value={cardColumns}
              onValueChange={(val) => setCardColumns(val as "1" | "2" | "4")}
            >
              <ToggleGroupItem value="1" aria-label="Toggle single column">
                <LayoutPanelTop className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="2" aria-label="Toggle two columns">
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="3" aria-label="Toggle four columns">
                <Grid3x3 className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>

        {/* Views */}
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No reviews found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "card" ? (
          <div
            className={`grid gap-6 ${cardColumns === "1"
              ? "grid-cols-1"
              : cardColumns === "2"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              }`}
          >
            {filteredReviews.map((review) => (
              <Card
                key={review._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          by {review.pseudonym} • {" "}
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(review._id)}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${bookmarkedIds.includes(review._id)
                          ? "fill-current text-primary"
                          : "text-muted-foreground"
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
                          className={`w-4 h-4 ${star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>
                    <Badge variant={getSentimentColor(review.sentiment)}>
                      {review.sentiment}
                    </Badge>
                  </div>
                  <div>
                    {Array.isArray(review.images) && review.images?.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Image
                              src={review.images[0].url}
                              alt={review.title}
                              width={96}
                              height={96}
                              unoptimized
                              className="rounded-md object-cover w-24 h-24 cursor-pointer"
                              onClick={() => review.images && setPreviewImage(review.images[0].url)}
                            />
                          </DialogTrigger>  
                          <DialogContent className="max-w-fit p-0 bg-transparent border-none shadow-none">
                            <Image
                              src={previewImage || review.images[0].url}
                              alt="Preview"
                              width={800}
                              height={600}
                              unoptimized
                              className="rounded-lg max-h-[90vh] w-auto h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>
                  <div className="mb-4">
                    <HashtagParser text={review.content} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{review.reactions || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ReviewTable reviews={filteredReviews} />
        )}
      </div>
    </div>
  )
} 