import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog.types";
import { formatDate } from "date-fns";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: BlogPost;
}

export const PostCard = ({ post }: Props) => {
  return (
    <article key={post.id} className='group flex flex-col gap-4 border-b pb-4 md:flex-row'>
      <div className='md:w-1/3'>
        <Link href={`/blog/${post.id}`}>
          <div className='relative h-48 w-full overflow-hidden rounded-lg md:h-full'>
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className='object-cover transition-all duration-300 group-hover:scale-105'
            />
          </div>
        </Link>
      </div>
      <div className='flex flex-col md:w-2/3'>
        <div className='mb-2 flex flex-wrap gap-2'>
          {post.categories.map((category) => (
            <Badge key={category} variant='outline' className='text-xs'>
              {category}
            </Badge>
          ))}
        </div>
        <Link
          href={`/blog/${post.id}`}
          className='line-clamp-2 transition-all duration-300 hover:text-primary hover:underline'
        >
          <h3 className='mb-2 font-bold text-xl'>{post.title}</h3>
        </Link>
        <p className='mb-4 flex-grow text-muted-foreground'>{post.excerpt}</p>
        <div className='mt-auto flex items-center justify-between'>
          <div>
            <p className='font-medium text-sm'>{post.author.name}</p>
            <div className='flex items-center text-muted-foreground text-xs'>
              <Calendar className='mr-1 h-3 w-3' />
              <span>{formatDate(new Date(post.date), "MMMM d, yyyy")}</span>
              <span className='mx-1'>•</span>
              <Clock className='mr-1 h-3 w-3' />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <Link
            href={`/blog/${post.id}`}
            className='flex items-center font-medium text-sm hover:underline'
          >
            Read more <ChevronRight className='ml-1 h-4 w-4' />
          </Link>
        </div>
      </div>
    </article>
  );
};
