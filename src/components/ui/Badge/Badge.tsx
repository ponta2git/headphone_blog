import NextLink from "next/link";
import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeVariant = "default" | "outlined";

interface BadgeProps {
  children: ReactNode;
  href?: string;
  variant?: BadgeVariant;
  ariaLabel?: string;
  rel?: string;
  title?: string;
}

export function Badge({
  children,
  href,
  variant = "default",
  ariaLabel,
  rel,
  title,
}: BadgeProps) {
  const className = `${styles.badge} ${styles[variant]}`;

  if (href) {
    return (
      <NextLink
        href={href as never}
        className={className}
        aria-label={ariaLabel}
        rel={rel}
        title={title}
      >
        {children}
      </NextLink>
    );
  }

  return <span className={className}>{children}</span>;
}
