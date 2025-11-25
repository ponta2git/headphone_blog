import type { ReactNode } from "react";
import styles from "./PageLayout.module.css";

type MaxWidth = "narrow" | "normal" | "wide";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
}

export function PageLayout({ children, maxWidth = "normal" }: PageLayoutProps) {
  return (
    <main id="main" className={`${styles.layout} ${styles[maxWidth]}`}>
      {children}
    </main>
  );
}
