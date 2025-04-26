import PageLayout from "@/components/layout/(public)/page-layout";
import { delay } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  await delay(1000);

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0">
      <div>BlogDetailPage {slug}</div>
    </PageLayout>
  );
}
