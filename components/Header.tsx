"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type User = {
  pseudonym: string;
  avatar: string;
  seed: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  console.log(user)

  useEffect(() => {
    const stored = localStorage.getItem("trustdrop_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (error) {
        console.error("Invalid trustdrop_user JSON in localStorage.");
      }
    }
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TrustDrop</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/explore">
            <Button variant="ghost">Explore</Button>
          </Link>
          <Link href="/bookmarks">
            <Button variant="ghost">Bookmarks</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <ThemeToggle />

          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                {user.avatar}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {user.pseudonym}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
