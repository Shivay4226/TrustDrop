"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Star, Send, ArrowLeft, X, Trash } from "lucide-react"

import { generatePseudonym, generateAvatar } from "@/lib/user-utils"
import { extractHashtags } from "@/lib/hashtag-parser"
import { analyzeSentiment } from "@/lib/sentiment-analyzer"

export default function WriteReviewPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [reviewType, setReviewType] = useState<"company" | "product">("product")
  const [companyName, setCompanyName] = useState("")
  const [companyUrl, setCompanyUrl] = useState("")
  const [productName, setProductName] = useState("")
  const [productUrl, setProductUrl] = useState("")

  const [imagePreviews, setImagePreviews] = useState<
    { file: File; status: "uploading" | "success" | "error"; url?: string }[]
  >([])

  const [uploadError, setUploadError] = useState("")
  const maxFileSize = 10 * 1024 * 1024 // 10MB
  const maxFiles = 5;

  const [userData] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("trustdrop_user")
      if (stored) return JSON.parse(stored) 
      const pseudonym = generatePseudonym()
      const newUser = {
        pseudonym,
        avatar: generateAvatar(pseudonym),
        seed: Math.random().toString(36).substring(7),
      }
      localStorage.setItem("trustdrop_user", JSON.stringify(newUser))
      return newUser
    }
    return { pseudonym: "Anonymous", avatar: "A", seed: "default" }
  })

  const hashtags = extractHashtags(content)
  const sentiment = content ? analyzeSentiment(content) : null

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "trustdrop_unsigned")
    formData.append("folder", "trustdrop")

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/detjteioc/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )

    return res.data.secure_url
  }

  const onDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setUploadError("Each file must be an image and under 10MB.")
      return
    }

    setUploadError("")
    const uploads = acceptedFiles.map((file) => ({
      file,
      status: "uploading" as const,
    }))
    setImagePreviews((prev) => [...prev, ...uploads])

    for (const file of acceptedFiles) {
      try {
        const url = await uploadImageToCloudinary(file)
        setImagePreviews((prev) =>
          prev.map((img) =>
            img.file === file ? { ...img, status: "success", url } : img
          )
        )
      } catch (err) {
        setImagePreviews((prev) =>
          prev.map((img) =>
            img.file === file ? { ...img, status: "error" } : img
          )
        )
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: maxFileSize,
    maxFiles,
    onDrop,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content || rating === 0) return
    if (imagePreviews.some((img) => img.status === "uploading")) return alert("Wait for image uploads to finish")

    setIsSubmitting(true)
    try {
      const payload = {
        title,
        content,
        rating,
        sentiment: sentiment?.label || "neutral",
        sentimentScore: sentiment?.score || 0,
        pseudonym: userData.pseudonym,
        avatar: userData.avatar,
        hashtags,
        companyName,
        companyUrl,
        productName,
        productUrl,
        reviewType,
        images: imagePreviews.filter((img) => img.status === "success").map((img) => ({
          url: img.url,
          filename: img.file.name,
          size: img.file.size,
          mimetype: img.file.type,
        })),
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) router.push("/explore")
    } catch (error) {
      console.error("Review submission failed", error)
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Review Details</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={reviewType === "product" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewType("product")}
                  >
                    Product
                  </Button>
                  <Button
                    type="button"
                    variant={reviewType === "company" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewType("company")}
                  >
                    Company
                  </Button>
                </div>
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
                          className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Fields */}
                {reviewType === "company" && (
                  <>
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., Amazon"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyUrl">Company URL (optional)</Label>
                      <Input
                        id="companyUrl"
                        placeholder="https://amazon.com"
                        value={companyUrl}
                        onChange={(e) => setCompanyUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {reviewType === "product" && (
                  <>
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="e.g., Echo Dot 5th Gen"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productUrl">Product URL (optional)</Label>
                      <Input
                        id="productUrl"
                        placeholder="https://amazon.com/product/123"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}

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

                <div>
                  <Label>Upload Images (max 10MB each)</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
      ${uploadError ? "border-destructive bg-destructive/10 text-destructive" : ""}
      ${isDragActive && !uploadError ? "border-primary bg-muted" : "border-[#e5e5e5]"}
    `}
                  >
                    <input {...getInputProps()} />
                    {uploadError ? (
                      <p>{uploadError}</p>
                    ) : isDragActive ? (
                      <p>Drop the images here...</p>
                    ) : (
                      <p>Drag & drop images here, or click to select</p>
                    )}
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {imagePreviews.map((img, idx) => (
                        <div key={idx} className="relative w-[100px] h-[80px]">
                          <img
                            src={URL.createObjectURL(img.file)}
                            alt={img.file.name}
                            className={`w-full h-full object-cover border-2 border-[#667eea] rounded-xl shadow-md ${img.status === "error" ? "border-red-500" : img.status === "uploading" ? "border-yellow-400 animate-pulse" : "border-[#667eea]"}`}
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreviews((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-destructive/90 transition-all z-30"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
