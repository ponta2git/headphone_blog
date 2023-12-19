import Link from "next/link"

import { ActiveTabName, siteTabs } from "../../siteBasic"

export function Tab({ active }: { active: ActiveTabName }) {
  // タブが増えたら横幅は手動で調整すること
  return (
    <div className="relative z-10 flex flex-row justify-center md:mx-auto md:w-3/4 lg:w-3/5">
      {siteTabs.map((tab) =>
        active === tab.name ? (
          <div
            key={tab.name}
            className="w-28 rounded-t-md bg-slate-50 py-2 text-center text-sm font-semibold leading-snug tracking-[0.4px] transition-colors hover:text-[#404040cf] md:w-1/4"
          >
            <Link className="inline-block h-full w-full" href={tab.topPage}>
              {tab.displayText}
            </Link>
          </div>
        ) : (
          <div
            key={tab.name}
            className="w-28 rounded-t-md bg-[#9cbfdf] py-2 text-center text-sm font-light leading-snug tracking-[0.4px] transition-colors hover:bg-[#9cbfdf88]  hover:text-[#404040cf] md:w-1/4"
          >
            <Link
              key={tab.name}
              className="inline-block  h-full w-full"
              href={tab.topPage}
            >
              {tab.displayText}
            </Link>
          </div>
        ),
      )}
    </div>
  )
}
