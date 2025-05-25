import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/blog.types";
import { format } from "date-fns";
import { Calendar, ChevronLeft, Clock, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkStatus } from "./bookmark-status";
import { CopyPost } from "./copy-post";
import { ReadingProgress } from "./reading-progress";

interface RelatedPost {
  id: number;
  title: string;
  coverImage: string;
  date: string;
  author: {
    name: string;
  };
}

interface Props {
  slug: string;
}

export default function BlogDetailView({ slug }: Props) {
  console.log(slug);

  // Sample blog post data
  const blogPost: BlogPost = {
    id: 1,
    title: "10 Essential Skincare Tips for Healthy Glowing Skin",
    excerpt:
      "Discover the secrets to maintaining healthy, radiant skin with these expert-approved skincare tips that you can easily incorporate into your daily routine.",
    content: `
      <p>Achieving and maintaining healthy, glowing skin doesn't have to be complicated or expensive. With the right knowledge and consistent habits, you can transform your skin and boost your confidence. In this comprehensive guide, we'll explore ten essential skincare tips backed by dermatologists and beauty experts.</p>
      
      <h2>1. Understand Your Skin Type</h2>
      <p>Before diving into any skincare routine, it's crucial to understand your skin type. Whether you have dry, oily, combination, sensitive, or normal skin, your skincare products and routine should be tailored accordingly.</p>
      <p>For instance, if you have oily skin, look for oil-free, non-comedogenic products that won't clog your pores. If you have dry skin, opt for hydrating, cream-based products that provide extra moisture.</p>
      
      <blockquote>
        <p>"Understanding your skin type is the foundation of effective skincare. It's like knowing your body type before starting a fitness routine – it guides all your subsequent choices." – Dr. Sarah Mitchell, Dermatologist</p>
      </blockquote>
      
      <h2>2. Cleanse Properly, Twice Daily</h2>
      <p>Cleansing is the cornerstone of any skincare routine. It removes dirt, oil, makeup, and environmental pollutants that can clog pores and lead to breakouts.</p>
      <p>Cleanse your face in the morning to remove oils that have built up overnight, and in the evening to wash away the day's accumulation of dirt and makeup. Use lukewarm water, as hot water can strip your skin of its natural oils.</p>
      
      <h2>3. Never Skip Sunscreen</h2>
      <p>Sunscreen is non-negotiable, regardless of the weather or season. UV rays can penetrate clouds and windows, causing premature aging, hyperpigmentation, and increasing the risk of skin cancer.</p>
      <p>Choose a broad-spectrum sunscreen with at least SPF 30 and apply it generously to all exposed skin. Reapply every two hours when outdoors or after swimming or sweating.</p>
      
      <h2>4. Hydrate Inside and Out</h2>
      <p>Hydration is key to plump, healthy skin. Drink plenty of water throughout the day to maintain your skin's moisture balance from within.</p>
      <p>Externally, use a moisturizer appropriate for your skin type. Even oily skin needs hydration – just opt for lightweight, oil-free formulations.</p>
      
      <h2>5. Incorporate Antioxidants</h2>
      <p>Antioxidants like vitamin C, vitamin E, and niacinamide protect your skin from free radical damage caused by environmental stressors like pollution and UV radiation.</p>
      <p>A vitamin C serum in the morning can brighten your complexion and boost your sunscreen's effectiveness, while antioxidant-rich night creams can support skin repair while you sleep.</p>
      
      <h2>6. Exfoliate Regularly, But Gently</h2>
      <p>Exfoliation removes dead skin cells, revealing fresher, more radiant skin underneath. However, over-exfoliation can damage your skin barrier.</p>
      <p>For most skin types, exfoliating 1-3 times per week is sufficient. Choose between chemical exfoliants (like AHAs and BHAs) or physical exfoliants based on your skin's sensitivity.</p>
      
      <h2>7. Don't Touch Your Face</h2>
      <p>Our hands come into contact with countless surfaces and bacteria throughout the day. Touching your face can transfer these impurities to your skin, potentially leading to breakouts and infections.</p>
      <p>Be mindful of this habit and try to avoid resting your face on your hands or picking at blemishes, which can cause scarring and spread bacteria.</p>
      
      <h2>8. Get Adequate Sleep</h2>
      <p>They call it "beauty sleep" for a reason. During deep sleep, your body increases blood flow to the skin and produces new collagen, which prevents sagging and reduces fine lines.</p>
      <p>Aim for 7-9 hours of quality sleep each night. Consider using a silk pillowcase to reduce friction and prevent sleep creases.</p>
      
      <h2>9. Manage Stress</h2>
      <p>Chronic stress triggers inflammation and can exacerbate skin conditions like acne, eczema, and psoriasis. It can also accelerate aging by breaking down collagen.</p>
      <p>Incorporate stress-management techniques like meditation, yoga, or deep breathing exercises into your daily routine for healthier skin and overall wellbeing.</p>
      
      <h2>10. Maintain a Balanced Diet</h2>
      <p>What you eat reflects on your skin. A diet rich in fruits, vegetables, lean proteins, and healthy fats provides the nutrients your skin needs to look its best.</p>
      <p>Foods high in antioxidants (like berries and leafy greens) and omega-3 fatty acids (like salmon and walnuts) are particularly beneficial for skin health.</p>
      
      <h2>Conclusion</h2>
      <p>Beautiful skin is a reflection of consistent care and healthy habits. By understanding your skin's needs and following these ten essential tips, you can achieve the radiant, healthy complexion you desire.</p>
      <p>Remember that patience is key – significant improvements in skin health don't happen overnight. Give new products and routines at least 4-6 weeks to show results, and consult with a dermatologist for personalized advice, especially if you have specific skin concerns.</p>
    `,
    coverImage: "/images/blogs/blog-1.jpg",
    date: "2023-04-15",
    readTime: 8,
    author: {
      name: "Emma Johnson",
      avatar: "/images/feedbacks/avatar-1.png",
      bio: "Emma is a certified dermatologist with over 10 years of experience in skincare and beauty. She is passionate about helping people achieve their best skin through evidence-based approaches.",
      role: "Senior Beauty Editor",
    },
    categories: ["Skincare", "Beauty Tips"],
  };

  // Sample related posts
  const relatedPosts: RelatedPost[] = [
    {
      id: 2,
      title: "The Ultimate Guide to Sustainable Beauty Products",
      coverImage: "/images/blogs/blog-2.jpg",
      date: "2023-04-10",
      author: {
        name: "Michael Chen",
      },
    },
    {
      id: 4,
      title: "The Science Behind Anti-Aging Ingredients",
      coverImage: "/images/blogs/blog-3.jpg",
      date: "2023-03-28",
      author: {
        name: "Dr. James Wilson",
      },
    },
    {
      id: 5,
      title: "Hair Care Mistakes You Might Be Making",
      coverImage: "/images/blogs/blog-4.jpg",
      date: "2023-03-20",
      author: {
        name: "Olivia Thompson",
      },
    },
  ];

  // Format content with proper HTML
  const formatContent = () => {
    return { __html: blogPost.content };
  };

  return (
    <div className='relative'>
      <ReadingProgress />

      <div className='mx-auto w-full px-4 py-8'>
        {/* Back to Blog */}
        <div className='mb-8'>
          <Link href='/blog' className='flex items-center font-medium text-sm hover:underline'>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className='mx-auto max-w-6xl'>
          <header className='mb-8'>
            {/* Categories */}
            <div className='mb-4 flex flex-wrap gap-2'>
              {blogPost.categories.map((category) => (
                <Badge key={category} variant='secondary' className='text-xs'>
                  {category}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className='mb-4 font-bold text-3xl md:text-4xl lg:text-5xl'>{blogPost.title}</h1>

            {/* Meta */}
            <div className='mb-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm'>
              <div className='flex items-center'>
                <Calendar className='mr-1 h-4 w-4' />
                <span>{format(new Date(blogPost.date), "MMMM d, yyyy")}</span>
              </div>
              <div className='flex items-center'>
                <Clock className='mr-1 h-4 w-4' />
                <span>{blogPost.readTime} min read</span>
              </div>
              <div>
                - by <span className='font-medium'>{blogPost.author.name}</span>,{" "}
                <span className='text-muted-foreground text-sm'>{blogPost.author.role}</span>
              </div>
            </div>

            {/* Cover Image */}
            <div className='relative mb-8 aspect-video w-full overflow-hidden rounded-lg'>
              <Image
                src={blogPost.coverImage || "/placeholder.svg"}
                alt={blogPost.title}
                fill
                className='object-cover'
                priority
              />
            </div>
          </header>

          {/* Content and Sidebar Layout */}
          <div className='flex flex-col gap-8 lg:flex-row'>
            {/* Main Content */}
            <div className='lg:w-2/3'>
              {/* Article Content */}
              <div
                className='prose prose-lg max-w-none'
                dangerouslySetInnerHTML={formatContent()}
              />

              {/* Share and Bookmark */}
              <div className='my-12 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-sm'>Share:</span>
                  <Button variant='outline' size='icon' className='h-8 w-8 rounded-full'>
                    <Facebook className='h-4 w-4' />
                    <span className='sr-only'>Share on Facebook</span>
                  </Button>
                  <Button variant='outline' size='icon' className='h-8 w-8 rounded-full'>
                    <Twitter className='h-4 w-4' />
                    <span className='sr-only'>Share on Twitter</span>
                  </Button>
                  <CopyPost />
                </div>
                <BookmarkStatus />
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-8 lg:w-1/3'>
              <div className='sticky top-20'>
                {/* Related Posts */}
                <div>
                  <h3 className='mb-4 font-medium text-lg'>Related Posts</h3>
                  <div className='space-y-4'>
                    {relatedPosts.map((post) => (
                      <div key={post.id} className='group flex gap-3'>
                        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
                          <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className='object-cover transition-all duration-300 group-hover:scale-105'
                          />
                        </div>
                        <div>
                          <Link
                            href={`/blog/${post.id}`}
                            className='line-clamp-2 font-medium text-sm transition-all duration-300 group-hover:text-primary'
                          >
                            {post.title}
                          </Link>
                          <div className='mt-1 text-muted-foreground text-xs'>
                            {format(new Date(post.date), "MMM d, yyyy")} • {post.author.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
