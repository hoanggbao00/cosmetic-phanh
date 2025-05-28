import PrivateLayout from "@/components/layout/private/private-layout";

export default function ProductCategories() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb='Product Categories'
    >
      <div>Categories</div>
    </PrivateLayout>
  );
}
