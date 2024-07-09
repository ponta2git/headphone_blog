import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

import { PageTabName, allTabs } from "../../../domain/PageTab"

export function Tab({ active }: { active: PageTabName }) {
  // タブが増えたら横幅は手動で調整すること
  return (
    <div className="relative z-10 flex flex-row justify-center md:mx-auto md:w-3/4 lg:w-3/5">
      {allTabs.map((tab) =>
        active === tab.name ? (
          <div
            key={tab.name}
            className="w-28 items-center rounded-t-md bg-slate-50 text-center text-xs font-semibold leading-snug tracking-[0.4px] text-[#404040] transition-colors hover:text-[#404040cf] md:w-1/4"
          >
            <Link
              className="inline-flex h-full w-full flex-row items-center justify-center gap-1 py-[0.75rem]"
              href={tab.topPage}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className="inline-block h-4 w-4"
              />
              {tab.displayText}
            </Link>
          </div>
        ) : (
          <div
            key={tab.name}
            className="w-28 items-center rounded-t-md bg-[#a0c1df] text-center text-xs font-light leading-snug tracking-[0.4px] text-[#404040] transition-colors hover:bg-[#9cbfdf88] hover:text-[#404040cf] md:w-1/4"
          >
            <Link
              key={tab.name}
              className="inline-flex h-full w-full flex-row items-center justify-center gap-1 py-[0.75rem]"
              href={tab.topPage}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className="inline-block h-4 w-4"
              />
              {tab.displayText}
            </Link>
          </div>
        ),
      )}
    </div>
  )
}
