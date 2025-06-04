import PrivateLayout from "@/components/layout/private/private-layout"
import OrderForm from "../_components/order-form"

export default function NewOrderPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb="New Order"
      title="New Order"
      className="mx-auto w-full max-w-7xl"
    >
      <OrderForm />
    </PrivateLayout>
  )
}
