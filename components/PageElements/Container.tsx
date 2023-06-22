import type { ReactNode } from "react"

export default function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="mb-10 mt-4 w-screen bg-slate-50 px-8 py-10 leading-[1.9rem] tracking-wider text-neutral-700 drop-shadow-lg">
      {children}
    </main>
  )
}
