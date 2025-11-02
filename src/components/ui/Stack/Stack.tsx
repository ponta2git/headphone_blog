import type { CSSProperties, ReactNode } from "react";
import styles from "./Stack.module.css";

type Direction = "vertical" | "horizontal";
type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
type Align = "start" | "center" | "end" | "stretch";

interface StackProps {
  direction?: Direction;
  gap?: Gap;
  align?: Align;
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "nav";
}

const gapMap: Record<Gap, string> = {
  1: "var(--spacing-1)",
  2: "var(--spacing-2)",
  3: "var(--spacing-3)",
  4: "var(--spacing-4)",
  5: "var(--spacing-5)",
  6: "var(--spacing-6)",
  8: "var(--spacing-8)",
  10: "var(--spacing-10)",
  12: "var(--spacing-12)",
};

export function Stack({
  direction = "vertical",
  gap = 4,
  align = "stretch",
  children,
  className,
  as: Component = "div",
}: StackProps) {
  const style: CSSProperties = {
    "--stack-gap": gapMap[gap],
    "--stack-align": align,
  } as CSSProperties;

  return (
    <Component
      className={`${styles.stack} ${styles[direction]} ${className || ""}`}
      style={style}
    >
      {children}
    </Component>
  );
}
