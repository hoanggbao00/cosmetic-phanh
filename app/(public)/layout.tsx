import Footer from "@/components/layout/(public)/footer"
import { Header } from "@/components/layout/(public)/header/header"
import QueryProvider from "@/components/providers/query-provider"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <QueryProvider>
        <Header />
        {children}
        <Footer />
      </QueryProvider>
    </div>
  )
}
