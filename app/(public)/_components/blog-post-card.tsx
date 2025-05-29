import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/blog.types"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href="#" className="mb-4 block">
        <Button effect="shineHover" variant="ghost" className="h-full p-0">
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              width={600}
              height={400}
              className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Button>
      </Link>

      <div className="mb-2 flex items-center justify-center gap-2 text-primary text-sm">
        <CalendarIcon className="size-4" />
        <span>{post.date}</span>
        <span>—</span>
        <span>{post.author.name}</span>
      </div>

      <Link href="#" className="block px-4">
        <h3 className="mb-3 text-center font-semibold text-xl transition-colors hover:text-primary">
          {post.title}
        </h3>
      </Link>

      <p className="mb-4 line-clamp-3 h-16 px-4 text-muted-foreground text-sm leading-relaxed">
        {post.excerpt}
      </p>

      <Link
        href="#"
        className="mx-auto block w-fit border-gray-900 border-b text-center font-medium text-gray-900 text-sm transition-colors hover:border-primary hover:text-primary"
      >
        Read More
      </Link>
    </article>
  )
}
