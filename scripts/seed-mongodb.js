const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/trustdrop"

const sampleReviews = [
  {
    title: "Amazing product quality!",
    content:
      "I was really impressed with the #BuildQuality of this product. The materials feel premium and the craftsmanship is excellent. Definitely worth the price! #ValueForMoney",
    rating: 5,
    pseudonym: "HonestReviewer123",
    avatar: "H",
    hashtags: ["#BuildQuality", "#ValueForMoney"],
    sentiment: "positive",
    sentimentScore: 0.8,
    reactions: 12,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    title: "Terrible customer service experience",
    content:
      "Had a really bad experience with #CustomerService. They were unresponsive and unhelpful when I had a #DeliveryIssue. Would not recommend.",
    rating: 1,
    pseudonym: "FrustratedCustomer456",
    avatar: "F",
    hashtags: ["#CustomerService", "#DeliveryIssue"],
    sentiment: "negative",
    sentimentScore: 0.9,
    reactions: 8,
    createdAt: new Date("2024-01-14T15:45:00Z"),
    updatedAt: new Date("2024-01-14T15:45:00Z"),
  },
  {
    title: "Good value for money",
    content:
      "Overall decent product. The #UserExperience is smooth and the #ProductDesign is clean. Nothing spectacular but gets the job done. #ValueForMoney",
    rating: 4,
    pseudonym: "PracticalUser789",
    avatar: "P",
    hashtags: ["#UserExperience", "#ProductDesign", "#ValueForMoney"],
    sentiment: "positive",
    sentimentScore: 0.6,
    reactions: 5,
    createdAt: new Date("2024-01-13T09:20:00Z"),
    updatedAt: new Date("2024-01-13T09:20:00Z"),
  },
  {
    title: "Fast delivery but poor packaging",
    content:
      "The delivery was surprisingly fast, but the packaging was terrible. Product arrived damaged due to poor #PackagingQuality. Mixed feelings about this purchase.",
    rating: 3,
    pseudonym: "MixedFeelings101",
    avatar: "M",
    hashtags: ["#PackagingQuality", "#DeliveryIssue"],
    sentiment: "neutral",
    sentimentScore: 0.5,
    reactions: 3,
    createdAt: new Date("2024-01-12T14:20:00Z"),
    updatedAt: new Date("2024-01-12T14:20:00Z"),
  },
  {
    title: "Excellent support team!",
    content:
      "When I had issues, the #Support team was incredibly helpful and responsive. They resolved my problem quickly and professionally. Great #CustomerService!",
    rating: 5,
    pseudonym: "SatisfiedCustomer202",
    avatar: "S",
    hashtags: ["#Support", "#CustomerService"],
    sentiment: "positive",
    sentimentScore: 0.9,
    reactions: 15,
    createdAt: new Date("2024-01-11T11:10:00Z"),
    updatedAt: new Date("2024-01-11T11:10:00Z"),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("reviews")

    // Clear existing reviews
    await collection.deleteMany({})
    console.log("Cleared existing reviews")

    // Insert sample reviews
    const result = await collection.insertMany(sampleReviews)
    console.log(`Inserted ${result.insertedCount} sample reviews`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
