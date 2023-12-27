import type { ReactNode } from "react"

export default function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="relative z-0 mb-24 w-screen bg-slate-50 px-8 pb-12 pt-10 leading-8 tracking-wide text-neutral-700 md:mx-auto md:w-3/4 md:rounded lg:w-3/5">
      {children}
    </main>
  )
}
