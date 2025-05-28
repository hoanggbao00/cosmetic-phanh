import PrivateLayout from "@/components/layout/private/private-layout";
import CatalogTable from "./catalog-table";

export default function ProductCatalog() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb='Product Catalog'
    >
      <CatalogTable />
    </PrivateLayout>
  );
}
