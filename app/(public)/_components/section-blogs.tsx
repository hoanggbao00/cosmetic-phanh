"use client";

import { StarIcon } from "@/assets/icons/star-icon";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Best Foundation Creams",
    excerpt:
      "Aptent Arcu In Hendrerit Maximus Sed Porta Tempor; Ullamcorper Gravida.Curabitur Quis Nullam Nascetur Auctor.",
    date: "November 8, 2024",
    author: "Developer",
    image: "/images/blogs/blog-1.jpg",
  },
  {
    id: 2,
    title: "Nude Palette Eyeshadow",
    excerpt:
      "Praesent At Felis Nibh Pharetra Ligula Nascetur Lobortis; Semper Nostra Feugiat. At Lectus Bibendum Mus Netus Dis Gravida.",
    date: "November 8, 2024",
    author: "Developer",
    image: "/images/blogs/blog-2.jpg",
  },
  {
    id: 3,
    title: "Healthy Skin Assure Healthy Smile",
    excerpt:
      "Convallis Ullamcorper At Montes Habitant Fringilla Dapibus Nam. Id Blandit Nisl Euismod Cras Sed Porta Scelerisque.",
    date: "November 8, 2024",
    author: "Developer",
    image: "/images/blogs/blog-3.jpg",
  },
  {
    id: 4,
    title: "Summer Skincare Essentials",
    excerpt:
      "Vestibulum Ante Ipsum Primis In Faucibus Orci Luctus Et Ultrices Posuere Cubilia Curae; Donec Velit Neque, Auctor Sit Amet Aliquam Vel.",
    date: "November 8, 2024",
    author: "Developer",
    image: "/images/blogs/blog-4.jpg",
  },
  {
    id: 5,
    title: "Trending Lip Colors This Season",
    excerpt:
      "Mauris Blandit Aliquet Elit, Eget Tincidunt Nibh Pulvinar A. Curabitur Non Nulla Sit Amet Nisl Tempus Convallis Quis Ac Lectus.",
    date: "November 8, 2024",
    author: "Developer",
    image: "/images/blogs/blog-1.jpg",
  },
];

export default function SectionBlogs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visiblePosts = blogPosts.slice(currentIndex, currentIndex + 3);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(blogPosts.length - 3, prev + 1));
  };

  return (
    <section className="w-full bg-secondary px-4 py-16 font-serif">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StarIcon className="size-4 animate-spin text-primary" />
              <span className="text-sm">Updates & Insights</span>
            </div>
            <h2 className="font-semibold text-3xl text-gray-900 md:text-4xl lg:text-5xl">Beauty Talk & Trends</h2>
          </div>

          {/* Pagination */}
          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex >= blogPosts.length - 3}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href="#" className="mb-4 block">
        <Button effect="shineHover" variant="ghost" className="h-full p-0">
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.image || "/placeholder.svg"}
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
        <span>{post.author}</span>
      </div>

      <Link href="#" className="block px-4">
        <h3 className="mb-3 text-center font-semibold text-xl transition-colors hover:text-primary">{post.title}</h3>
      </Link>

      <p className="mb-4 line-clamp-3 h-16 px-4 text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>

      <Link
        href="#"
        className="mx-auto block w-fit border-gray-900 border-b text-center font-medium text-gray-900 text-sm transition-colors hover:border-primary hover:text-primary"
      >
        Read More
      </Link>
    </article>
  );
}
