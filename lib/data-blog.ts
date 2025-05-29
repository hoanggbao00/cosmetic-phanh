import type { BlogPost } from "@/types/blog.types"

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Essential Skincare Tips for Healthy Glowing Skin",
    excerpt:
      "Discover the secrets to maintaining healthy, radiant skin with these expert-approved skincare tips that you can easily incorporate into your daily routine.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-1.jpg",
    date: "2023-04-15",
    readTime: 5,
    author: {
      name: "Emma Johnson",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Skincare", "Beauty Tips"],
    featured: true,
  },
  {
    id: 2,
    title: "The Ultimate Guide to Sustainable Beauty Products",
    excerpt:
      "Learn how to make environmentally conscious choices with our comprehensive guide to sustainable beauty products and brands that are making a difference.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-2.jpg",
    date: "2023-04-10",
    readTime: 8,
    author: {
      name: "Michael Chen",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Sustainability", "Product Reviews"],
  },
  {
    id: 3,
    title: "How to Create the Perfect Makeup Look for Summer",
    excerpt:
      "Get ready for the summer season with these fresh makeup techniques that will keep you looking fabulous even in the heat and humidity.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-3.jpg",
    date: "2023-04-05",
    readTime: 6,
    author: {
      name: "Sophia Rodriguez",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Makeup", "Seasonal"],
  },
  {
    id: 4,
    title: "The Science Behind Anti-Aging Ingredients",
    excerpt:
      "Dive deep into the scientific research behind popular anti-aging ingredients and discover which ones actually deliver on their promises.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-4.jpg",
    date: "2023-03-28",
    readTime: 10,
    author: {
      name: "Dr. James Wilson",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Skincare", "Science"],
    featured: true,
  },
  {
    id: 5,
    title: "Hair Care Mistakes You Might Be Making",
    excerpt:
      "Are you unknowingly damaging your hair? Learn about common hair care mistakes and how to correct them for healthier, more beautiful locks.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-1.jpg",
    date: "2023-03-20",
    readTime: 7,
    author: {
      name: "Olivia Thompson",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Hair Care"],
  },
  {
    id: 6,
    title: "Vegan Beauty: A Beginner's Guide",
    excerpt:
      "Interested in transitioning to vegan beauty products? This beginner-friendly guide will help you understand what to look for and which brands to try.",
    content: "Full content here...",
    coverImage: "/images/blogs/blog-2.jpg",
    date: "2023-03-15",
    readTime: 6,
    author: {
      name: "Emma Johnson",
      avatar: "/images/feedbacks/avatar-1.png",
    },
    categories: ["Vegan", "Product Reviews"],
  },
]

export const allCategories = Array.from(new Set(blogPosts.flatMap((post) => post.categories)))
