import PrivateLayout from "@/components/layout/private/private-layout"
import VoucherTable from "./voucher-table"

export default function VoucherPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Vouchers"
      title="Vouchers"
    >
      <VoucherTable />
    </PrivateLayout>
  )
}
