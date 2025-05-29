"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useState } from "react"

export const BookmarkStatus = () => {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-1"
      onClick={() => setIsBookmarked(!isBookmarked)}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Save</span>
        </>
      )}
    </Button>
  )
}
