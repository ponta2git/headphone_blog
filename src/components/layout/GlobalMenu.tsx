import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons/faCommentDots";
import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface MenuItemProps {
  href: string;
  icon: IconDefinition;
  label: string;
}

const MenuItem = ({ href, icon, label }: MenuItemProps) => (
  <li className="text-center">
    <Link href={href}>
      <span className="focus:ring-accent block transform rounded-md px-2 py-2 align-middle text-sm font-medium text-text-nav transition-colors duration-200 hover:scale-105 hover:bg-bg-hover focus:ring-2 focus:ring-offset-2 focus:outline-none">
        <FontAwesomeIcon icon={icon} className="mr-1 inline-block h-4 w-4" />{" "}
        {label}
      </span>
    </Link>
  </li>
);

export default function GlobalMenu() {
  const menuItems: MenuItemProps[] = [
    { href: "/", icon: faBolt, label: "新着" },
    { href: "/impressions", icon: faHeadphonesSimple, label: "感想" },
    { href: "/discussions", icon: faCommentDots, label: "考察" },
    { href: "/tags", icon: faMagnifyingGlass, label: "さがす" },
  ];

  return (
    <nav
      className="font-header-setting rounded-lg bg-bg-menu p-3 shadow-md"
      aria-label="グローバルナビゲーション"
    >
      <ul className="flex items-center justify-evenly space-x-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </ul>
    </nav>
  );
}
