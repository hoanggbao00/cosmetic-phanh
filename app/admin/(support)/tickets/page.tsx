import PrivateLayout from "@/components/layout/private/private-layout"
import TicketTable from "./ticket-table"

export default function TicketPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Support Tickets"
      title="Support Tickets"
    >
      <TicketTable />
    </PrivateLayout>
  )
}
