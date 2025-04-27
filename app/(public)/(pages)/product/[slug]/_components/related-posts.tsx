"use client";
import BlogPostCard from "@/app/(public)/_components/blog-post-card";
import type { BlogPost } from "@/types/blog.types";
import {} from "lucide-react";

interface RelatedPostsProps {
  productCategory: string;
}

export default function RelatedPosts({ productCategory }: RelatedPostsProps) {
  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Essential Skincare Tips for Healthy Glowing Skin",
      excerpt:
        "Discover the secrets to maintaining healthy, radiant skin with these expert-approved skincare tips that you can easily incorporate into your daily routine.",
      coverImage: "/images/blogs/blog-1.jpg",
      date: "2023-04-15",
      categories: ["Skincare"],
      content: "This is the content of the blog post",
      readTime: 5,
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=400&width=600&text=Avatar",
        bio: "John Doe is a skincare expert with a passion for helping people achieve healthy, radiant skin.",
        role: "Skincare Expert",
      },
    },
    {
      id: 2,
      title: "The Science Behind Vitamin C Serums",
      excerpt:
        "Learn how vitamin C serums work to brighten skin, boost collagen production, and protect against environmental damage for a more youthful complexion.",
      coverImage: "/images/blogs/blog-2.jpg",
      date: "2023-03-28",
      categories: ["Skincare"],
      content: "This is the content of the blog post",
      readTime: 5,
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=400&width=600&text=Avatar",
        bio: "John Doe is a skincare expert with a passion for helping people achieve healthy, radiant skin.",
        role: "Skincare Expert",
      },
    },
    {
      id: 3,
      title: "How to Layer Your Skincare Products for Maximum Effectiveness",
      excerpt:
        "Master the art of layering your skincare products in the correct order to maximize their benefits and address multiple skin concerns simultaneously.",
      coverImage: "/images/blogs/blog-3.jpg",
      date: "2023-03-10",
      categories: ["Skincare"],
      content: "This is the content of the blog post",
      readTime: 5,
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=400&width=600&text=Avatar",
        bio: "John Doe is a skincare expert with a passion for helping people achieve healthy, radiant skin.",
        role: "Skincare Expert",
      },
    },
    {
      id: 4,
      title: "Understanding Hyaluronic Acid: The Ultimate Hydration Ingredient",
      excerpt:
        "Dive deep into the science of hyaluronic acid, how it works to hydrate your skin, and why it's a must-have ingredient in your skincare routine.",
      coverImage: "/images/blogs/blog-4.jpg",
      date: "2023-02-22",
      categories: ["Ingredients"],
      content: "This is the content of the blog post",
      readTime: 5,
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=400&width=600&text=Avatar",
        bio: "John Doe is a skincare expert with a passion for helping people achieve healthy, radiant skin.",
        role: "Skincare Expert",
      },
    },
  ];

  // Filter posts related to the product category
  const relatedPosts = blogPosts.filter(
    (post) =>
      post.categories.some((category) => category.toLowerCase() === productCategory.toLowerCase()) ||
      post.title.includes(productCategory),
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {relatedPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
