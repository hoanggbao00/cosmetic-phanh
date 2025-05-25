import PageLayout from "@/components/layout/(public)/page-layout";
import BlogListPage from "./_components/blog-page-view";

export default function BlogPage() {
  return (
    <PageLayout className='mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0'>
      <BlogListPage />
    </PageLayout>
  );
}
