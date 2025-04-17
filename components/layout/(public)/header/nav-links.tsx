import { NavItem } from "./nav-item";

export const NavLinks = () => {
  return (
    <nav className="flex-1">
      <ul className="flex items-center gap-4">
        <li>
          <NavItem href="/" isActive={true}>
            Home
          </NavItem>
        </li>
        <li>
          <NavItem href="/catalog">Catalog</NavItem>
        </li>
        <li>
          <NavItem href="/blog">Blog</NavItem>
        </li>
        <li>
          <NavItem href="/about">About</NavItem>
        </li>
        <li>
          <NavItem href="/contact">Contact</NavItem>
        </li>
      </ul>
    </nav>
  );
};
