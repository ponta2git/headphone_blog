import type { ReactNode } from "react"

export default function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="mb-16 w-screen bg-slate-50 px-8 pb-8 leading-[1.9rem] tracking-wider text-neutral-700 drop-shadow-xl md:mx-auto md:w-3/4 md:rounded-md lg:w-3/5">
      {children}
    </main>
  )
}
