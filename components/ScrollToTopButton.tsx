"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-opacity duration-300
    bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground
    ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
