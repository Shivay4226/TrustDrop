"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generatePseudonym, generateAvatar } from "@/lib/user-utils"
import { extractHashtags } from "@/lib/hashtag-parser"
import { analyzeSentiment } from "@/lib/sentiment-analyzer"

export default function WriteReviewPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get or generate user data
  const [userData] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("trustdrop_user")
      if (stored) {
        return JSON.parse(stored)
      }
      const newUser = {
        pseudonym: generatePseudonym(),
        avatar: generateAvatar(),
        seed: Math.random().toString(36).substring(7),
      }
      localStorage.setItem("trustdrop_user", JSON.stringify(newUser))
      return newUser
    }
    return { pseudonym: "Anonymous", avatar: "A", seed: "default" }
  })

  const hashtags = extractHashtags(content)
  const sentiment = content ? analyzeSentiment(content) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content || rating === 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          rating,
          pseudonym: userData.pseudonym,
          avatar: userData.avatar,
          hashtags,
          sentiment: sentiment?.label || "neutral",
          sentimentScore: sentiment?.score || 0,
        }),
      })

      if (response.ok) {
        router.push("/explore")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Write a Review</h1>
              <p className="text-muted-foreground">Share your honest experience anonymously</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{userData.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Posting as {userData.pseudonym}</CardTitle>
                  <CardDescription>Your identity is protected</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Summarize your experience..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Your Review</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your detailed experience... Use #hashtags to categorize your review"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {hashtags.length > 0 && (
                  <div>
                    <Label>Detected Hashtags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {sentiment && (
                  <div>
                    <Label>Sentiment Analysis</Label>
                    <div className="mt-2">
                      <Badge
                        variant={
                          sentiment.label === "positive"
                            ? "default"
                            : sentiment.label === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {sentiment.label} ({Math.round(sentiment.score * 100)}%)
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Publishing..." : "Publish Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
