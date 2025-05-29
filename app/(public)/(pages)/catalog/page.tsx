import PageLayout from "@/components/layout/(public)/page-layout"
import CatalogPageView, { type FilterAndSortParams } from "./_components/catalog-page"

interface Props {
  searchParams: Promise<FilterAndSortParams>
}

export default async function CatalogPage({ searchParams: s }: Props) {
  const searchParams = await s

  return (
    <PageLayout>
      <CatalogPageView searchParams={searchParams} />
    </PageLayout>
  )
}
