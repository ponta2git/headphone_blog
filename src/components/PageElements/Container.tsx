import type { ReactNode } from "react"

export default function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="mb-14 w-screen bg-slate-50 px-8 py-8 leading-[1.9rem] tracking-wider text-neutral-700 drop-shadow-xl md:rounded-md md:mx-auto md:w-3/4 lg:w-3/5">
      {children}
    </main>
  )
}
