import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";

export async function GET() {
  try {
    await connectToDatabase();

    const pipeline: any[] = [
      { $unwind: { path: "$hashtags" } }, 
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: null,
          tags: {
            $push: {
              tag: "$_id",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
      { $unwind: { path: "$tags" } },
      {
        $project: {
          _id: 0,
          tag: "$tags.tag",
          count: "$tags.count",
          percent: {
            $round: [
              { $multiply: [{ $divide: ["$tags.count", "$total"] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { count: -1 } },
    ];
    
    const trendingTags = await Review.aggregate(pipeline);

    return NextResponse.json(trendingTags);
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending tags" },
      { status: 500 }
    );
  }
}
