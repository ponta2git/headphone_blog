import Link from "next/link";

interface PageMenuItem {
  label: string;
  href: string;
}

type Props = {
  menuItems: PageMenuItem[];
};

export const PageMenu: React.FC<Props> = ({ menuItems }) => {
  return (
    <nav
      id="page-menu"
      className="fit-content center bg-content border-rounded-xsmall border-solid-light"
      title="ページ内メニュー"
    >
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.href}
            className="page-menu-item font-header text-decoration-none"
          >
            <Link href={`#${item.href}`}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
