"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export const ReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }

    window.addEventListener("scroll", updateReadingProgress)
    return () => window.removeEventListener("scroll", updateReadingProgress)
  }, [])

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-1">
      <Progress value={readingProgress} className="h-1 rounded-none" />
    </div>
  )
}
