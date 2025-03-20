import type { ReactNode } from "react";

export function TopHeader({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-header-setting line-break-strict text-2xl leading-snug font-bold tracking-[0.6px]">
      {children}
    </h1>
  );
}
