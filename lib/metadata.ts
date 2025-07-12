import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "TrustDrop",
  description: "Anonymous review platform for honest feedback and free expression.",
  openGraph: {
    title: "TrustDrop",
    description: "Speak your truth anonymously and safely.",
    url: "https://trustdrop.vercel.app",
    siteName: "TrustDrop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrustDrop Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustDrop",
    description: "Speak your truth anonymously and safely.",
    images: ["/og-image.png"],
  },
};

export const aboutMetadata: Metadata = {
  ...defaultMetadata,
  title: "About Us - TrustDrop",
  description: "Learn about TrustDrop’s mission, values, and the people behind the anonymous review platform.",
};

export const exploreMetadata: Metadata = {
  ...defaultMetadata,
  title: "Explore - TrustDrop",
  description: "Discover anonymous reviews and trending voices on TrustDrop.",
};

export const bookmarksMetadata: Metadata = {
  ...defaultMetadata,
  title: "Bookmarks - TrustDrop",
  description: "Your saved anonymous reviews and feedback in one place.",
};
