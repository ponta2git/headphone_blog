import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons/faCommentDots";
import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { Route } from "next";

interface MenuItem {
  href: Route;
  icon: IconDefinition;
  label: string;
}

const menuItems: MenuItem[] = [
  { href: "/", icon: faBolt, label: "新着" },
  { href: "/impressions", icon: faHeadphonesSimple, label: "感想" },
  { href: "/discussions", icon: faCommentDots, label: "考察" },
  { href: "/tags", icon: faMagnifyingGlass, label: "さがす" },
];

const MenuItem = ({ href, icon, label }: MenuItem) => (
  <li>
    <Link href={href}>
      <div className="global-menu-item border-rounded-small bg-sub-hover">
        <FontAwesomeIcon icon={icon} />
        <span className="text-small font-header">{label}</span>
      </div>
    </Link>
  </li>
);

export default function GlobalMenu() {
  return (
    <nav
      id="global-menu"
      className="fit-content bg-sub border-solid border-rounded"
      title="グローバルメニュー"
    >
      <ul>
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
