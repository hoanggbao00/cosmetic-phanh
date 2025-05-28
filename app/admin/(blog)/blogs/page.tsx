import PrivateLayout from "@/components/layout/private/private-layout";

export default function BlogsPage() {
  return (
    <PrivateLayout parentBreadcrumb={{ title: "Admin", href: "/admin" }} currentBreadcrumb='Blogs'>
      <div>Blogs</div>
    </PrivateLayout>
  );
}
