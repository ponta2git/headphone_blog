import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-0 mb-12 w-screen border-y-2 border-[#f0f8ff] bg-white px-8 pt-6 pb-10 leading-8 tracking-wide md:mx-auto md:w-3/4 md:rounded-xl md:border-2 lg:w-3/5">
      {children}
    </main>
  );
}
