import PrivateLayout from "@/components/layout/private/private-layout";

export default function BlogCategories() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb='Blog Categories'
    >
      <div>Blog Categories</div>
    </PrivateLayout>
  );
}
