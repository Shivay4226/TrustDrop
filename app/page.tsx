import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Bookmark, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function HomePage() {
  // const trendingTags = [
  //   "#BuildQuality",
  //   "#Returns",
  //   "#CustomerService",
  //   "#DeliveryIssue",
  //   "#ValueForMoney",
  //   "#UserExperience",
  //   "#ProductDesign",
  //   "#Support",
  // ]

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/reviews/tag/trending`, {
    cache: "no-store",
  });

  const trendingTags = await res.json();

  const features = [
    {
      icon: Star,
      title: "Rate What Matters",
      description: "Share honest ratings and detailed reviews without revealing your identity",
    },
    {
      icon: Bookmark,
      title: "Bookmark Reviews",
      description: "Save important reviews locally and access them anytime",
    },
    {
      icon: Shield,
      title: "Stay Anonymous",
      description: "No signup required. Your privacy is protected with pseudonyms",
    },
    {
      icon: TrendingUp,
      title: "Trending Insights",
      description: "Discover what's trending through hashtags and sentiment analysis",
    },
    {
      icon: MessageSquare,
      title: "Smart Analysis",
      description: "Automatic sentiment detection and hashtag extraction from reviews",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of honest reviewers making better decisions",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TrustDrop</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link href="/bookmarks">
              <Button variant="ghost">Bookmarks</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Honest Reviews,
            <br />
            Anonymous Voices
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            No login, no fear, just trust. Share your experiences and discover authentic reviews from real people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/write-review">
              <Button size="lg" className="text-lg px-8 py-6">
                <MessageSquare className="w-5 h-5 mr-2" />
                Write a Review
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <TrendingUp className="w-5 h-5 mr-2" />
                Explore Reviews
              </Button>
            </Link>
          </div>

          {/* Trending Hashtags */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Trending Now</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTags.map((item: any) => (
                <Link key={item.tag} href={`/tag/${item.tag.slice(1)}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {item.tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TrustDrop?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the freedom of honest reviews without compromising your privacy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-muted/50">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Anonymous Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Positive Sentiment</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Trending Tags</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Voice?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of anonymous reviewers making a difference in the community
          </p>
          <Link href="/write-review">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">TrustDrop</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2024 TrustDrop. Anonymous reviews, trusted insights.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
