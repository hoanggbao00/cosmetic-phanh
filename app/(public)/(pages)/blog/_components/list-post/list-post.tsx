import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up";
import { blogPosts } from "@/lib/data-blog";
import { PostCard } from "./post-card";

interface ListPostProps {
  searchQuery: string;
  selectedCategory: string;
}

export const ListPost = ({ searchQuery, selectedCategory }: ListPostProps) => {
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? post.categories.includes(selectedCategory) : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <FadeUpContainer className="grid grid-cols-1 gap-4 md:gap-6" delay={0.5}>
      {filteredPosts.map((post) => (
        <FadeUpItem key={post.id}>
          <PostCard post={post} />
        </FadeUpItem>
      ))}
    </FadeUpContainer>
  );
};
