import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/lib/models/Review"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const { ids } = await request.json()

    const reviews = await Review.find({ _id: { $in: ids } }).sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching bookmarked reviews:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarked reviews" }, { status: 500 })
  }
}
