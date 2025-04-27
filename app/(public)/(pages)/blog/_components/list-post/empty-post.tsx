"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  searchQuery: string;
  selectedCategory: string;
}

export const EmptyPost = ({ searchQuery, selectedCategory }: Props) => {
  const router = useRouter();

  const handleClearFilters = () => {
    router.push("/blog");
  };

  return (
    <div className="rounded-lg border py-12 text-center">
      <h3 className="mb-2 font-medium text-lg">No posts found</h3>
      <p className="mb-4 text-muted-foreground">
        {searchQuery
          ? `No posts matching "${searchQuery}"`
          : selectedCategory
            ? `No posts in the "${selectedCategory}" category`
            : "No posts available"}
      </p>
      <Button variant="outline" onClick={handleClearFilters}>
        Clear filters
      </Button>
    </div>
  );
};
