import PrivateLayout from "@/components/layout/private/private-layout";

export default function OrdersPage() {
  return (
    <PrivateLayout parentBreadcrumb={{ title: "Admin", href: "/admin" }} currentBreadcrumb='Orders'>
      <div>Orders</div>
    </PrivateLayout>
  );
}
