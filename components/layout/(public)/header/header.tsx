import { HeaderNav } from "./header-nav"
import { TopBar } from "./top-bar"

export const Header = () => {
  return (
    <header id="header" className="absolute top-0 right-0 left-0 z-50 space-y-2">
      <TopBar />
      <HeaderNav />
    </header>
  )
}
