import PageLayout from "@/components/layout/(public)/page-layout";
import { delay } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  await delay(1000);

  return (
    <PageLayout className="min-h-screen">
      <div>ProductDetailPage {slug}</div>
    </PageLayout>
  );
}
