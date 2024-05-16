import type { ReactNode } from "react"

export default function Container({
  postMode = false,
  children,
}: {
  children?: ReactNode
  postMode?: boolean
}) {
  return (
    <main
      className={`relative z-0 ${postMode ? "mb-10" : "mb-24"} w-screen bg-slate-50 px-8 pb-12 pt-6 leading-8 tracking-wide text-neutral-700 md:mx-auto md:w-3/4 md:rounded-xl lg:w-3/5`}
    >
      {children}
    </main>
  )
}
