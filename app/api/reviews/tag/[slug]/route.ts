import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/lib/models/Review"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase()
    const tag = `#${params.slug}`

    const reviews = await Review.find({
      hashtags: { $in: [tag] },
    }).sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching tag reviews:", error)
    return NextResponse.json({ error: "Failed to fetch tag reviews" }, { status: 500 })
  }
}
