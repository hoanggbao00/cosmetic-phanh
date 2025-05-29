import PrivateLayout from "@/components/layout/private/private-layout"

export default function Dashboard() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Dashboard"
    >
      <div>Dashboard</div>
    </PrivateLayout>
  )
}
