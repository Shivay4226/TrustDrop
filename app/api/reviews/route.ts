import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/lib/models/Review"

export async function GET() {
  try {
    await connectToDatabase()
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(50)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

   const review = new Review({
      title: body.title,
      content: body.content,
      rating: body.rating,
      pseudonym: body.pseudonym,
      avatar: body.avatar,
      hashtags: body.hashtags || [],
      sentiment: body.sentiment || "neutral",
      sentimentScore: body.sentimentScore || 0,
      reactions: 0,
      companyName: body.companyName || "",
      companyUrl: body.companyUrl || "",
      productName: body.productName || "",
      productUrl: body.productUrl || "",
    })

    await review.save()
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
