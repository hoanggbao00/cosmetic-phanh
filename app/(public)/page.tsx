import SectionBlogs from "./_components/section-blogs"
import { SectionCategory } from "./_components/section-category"
import { SectionCollections } from "./_components/section-collections"
import SectionFeedback from "./_components/section-feedback"
import { SectionHome } from "./_components/section-home"

export default function Home() {
  return (
    <div className="min-h-screen space-y-6 bg-white">
      <SectionHome />
      <SectionCategory />
      <SectionCollections title="Trendy Collections" subTitle="Nourish & Hydrate" />
      <SectionCollections title="Shop Skin Care Solutions" subTitle="Nourish & Hydrate" />
      <SectionBlogs />
      <SectionFeedback />
    </div>
  )
}
