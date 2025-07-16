import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/lib/models/Review"

export async function GET() {
  try {
    await connectToDatabase()
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(50)
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const review = new Review({
      ...body,
      rating: Number(body.rating),
      sentimentScore: Number(body.sentimentScore),
      images: body.images || [],
    })

    await review.save()
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
