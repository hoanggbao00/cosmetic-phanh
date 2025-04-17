import { Header } from "@/components/layout/(public)/header/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      {children}
    </div>
  );
}
