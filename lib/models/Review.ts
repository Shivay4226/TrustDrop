import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    pseudonym: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    hashtags: [
      {
        type: String,
      },
    ],
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    reactions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
ReviewSchema.index({ hashtags: 1 })
ReviewSchema.index({ sentiment: 1 })
ReviewSchema.index({ rating: 1 })
ReviewSchema.index({ createdAt: -1 })

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema)
