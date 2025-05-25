import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up";
import { blogPosts } from "@/lib/data-blog";
import { FeaturedPostCard } from "./featured-post-card";

export const FeaturedPost = () => {
  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    featuredPosts.length > 0 && (
      <div className='mb-12'>
        <h2 className='mb-6 font-bold text-2xl'>Featured Posts</h2>
        <FadeUpContainer className='grid grid-cols-1 gap-6 md:grid-cols-2' delay={0.1}>
          {featuredPosts.map((post) => (
            <FadeUpItem key={post.id}>
              <FeaturedPostCard post={post} />
            </FadeUpItem>
          ))}
        </FadeUpContainer>
      </div>
    )
  );
};
