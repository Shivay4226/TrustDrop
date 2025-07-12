export const metadata = {
  title: "About Us - TrustDrop",
  description: "Learn about TrustDrop’s mission, vision, values, and the people behind the anonymous review platform.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-primary">About TrustDrop</h1>

      {/* Introduction */}
      <section className="mb-10">
        <p className="text-muted-foreground text-lg mb-4">
          At <span className="font-semibold text-foreground">TrustDrop</span>, we believe that honest feedback should never come at the cost of fear. Our platform enables individuals to share genuine reviews and insights—anonymously, securely, and respectfully.
        </p>
        <p className="text-muted-foreground text-lg">
          Whether you're giving feedback on a workplace, product, school, or service—TrustDrop provides a safe environment to express your thoughts freely and constructively.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-muted-foreground text-lg">
          To empower voices through anonymity—driving transparency, accountability, and improvement across communities, workplaces, and industries.
        </p>
      </section>

      {/* Vision */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="text-muted-foreground text-lg">
          A world where every individual can express truth without fear—shaping a more open, respectful, and fair digital ecosystem.
        </p>
      </section>

      {/* Core Values */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Core Values</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-lg">
          <li><strong>Integrity:</strong> Truth and trust form our foundation.</li>
          <li><strong>Privacy:</strong> We protect user identity with robust privacy-first systems.</li>
          <li><strong>Community:</strong> We value respectful, honest, and safe dialogue.</li>
          <li><strong>Innovation:</strong> We evolve continuously to support meaningful anonymous engagement.</li>
        </ul>
      </section>

      {/* Our Story */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">How It All Started</h2>
        <p className="text-muted-foreground text-lg mb-4">
          TrustDrop was born out of a simple question: <em>“What if people could speak the truth without fear?”</em> 
        </p>
        <p className="text-muted-foreground text-lg mb-4">
          In 2024, a small group of developers and community builders decided to create a platform where anonymity could empower—not enable abuse. After months of research and development, TrustDrop launched with the goal of giving people a voice while upholding ethics and accountability.
        </p>
      </section>

      {/* The People Behind TrustDrop */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
        <p className="text-muted-foreground text-lg mb-4">
          We're a small, passionate team of engineers, designers, moderators, and privacy advocates from around the world—united by the belief that honesty drives growth.
        </p>
        <p className="text-muted-foreground text-lg">
          While our team remains intentionally anonymous—just like our users—we work transparently, listening to your feedback and continuously improving the platform.
        </p>
      </section>

      {/* Final Note */}
      <section>
        <p className="text-lg font-medium text-foreground">
          Thank you for being part of this movement. Together, let’s make the internet a place where truth and trust coexist.
        </p>
        <p className="mt-4 text-muted-foreground text-sm italic">– The TrustDrop Team</p>
      </section>
    </main>
  );
}
  