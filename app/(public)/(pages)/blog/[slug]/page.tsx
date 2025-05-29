import PageLayout from "@/components/layout/(public)/page-layout"
import { delay } from "@/lib/utils"
import BlogDetailView from "./_components/blog-detail"
interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  await delay(1000)

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-6xl px-4 md:px-0">
      <BlogDetailView slug={slug} />
    </PageLayout>
  )
}
