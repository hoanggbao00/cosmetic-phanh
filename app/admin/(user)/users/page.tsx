import PrivateLayout from "@/components/layout/private/private-layout"
import UsersTable from "./users-table"

export default function UsersPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Users"
      title="Users"
    >
      <UsersTable />
    </PrivateLayout>
  )
}
