import NextLink from "next/link";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons/faExternalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import styles from "./Link.module.css";

type LinkVariant = "primary" | "secondary" | "muted";

interface LinkProps {
  href: string;
  variant?: LinkVariant;
  external?: boolean;
  children: ReactNode;
  className?: string;
}

export function Link({
  href,
  variant = "primary",
  external = false,
  children,
  className,
}: LinkProps) {
  const isExternal = external || href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={`${styles.link} ${styles[variant]} ${className || ""}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <FontAwesomeIcon icon={faExternalLink} className={styles.icon} />
      </a>
    );
  }

  return (
    <NextLink
      href={href as never}
      className={`${styles.link} ${styles[variant]} ${className || ""}`}
    >
      {children}
    </NextLink>
  );
}
