import CatalogPageView, { type FilterAndSortParams } from "./_components/catalog-page";

interface Props {
  searchParams: Promise<FilterAndSortParams>;
}

export default async function CatalogPage({ searchParams: s }: Props) {
  const searchParams = await s;

  return (
    <div className="mt-28">
      <CatalogPageView searchParams={searchParams} />
    </div>
  );
}
