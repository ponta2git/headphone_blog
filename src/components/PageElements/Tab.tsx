import Link from "next/link"
import { ActiveTabName, siteTabs } from "../../siteBasic"

export function Tab({ active }: { active: ActiveTabName }) {
  // タブが増えたら横幅は手動で調整すること
  return (
    <div className="flex flex-row">
      {siteTabs.map((tab) =>
        active === tab.name ? (
          <div
            key={tab.name}
            className="mx-8 mb-6 mt-6 w-1/2 text-center text-sm"
          >
            <Link href={tab.topPage}>
              <div className="max-w-screen mx-auto flex items-center justify-center transition-colors hover:text-[#40404088]">
                <div className="w-full bg-[#1E6FBA] pb-[2px]">
                  <div className="w-full bg-slate-50 pb-1 font-semibold">
                    {tab.displayText}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div
            key={tab.name}
            className="mx-8 mb-6 mt-6 w-1/2 text-center text-sm transition-colors hover:text-[#40404088]"
          >
            <Link href={tab.topPage}>
              <div className="max-w-screen mx-auto flex items-center justify-center">
                <div className="w-full bg-[#d9dde3] pb-[2px]">
                  <div className="w-full bg-slate-50 pb-1">
                    {tab.displayText}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ),
      )}
    </div>
  )
}
