import Link from "next/link"
import { ActiveTabName, siteTabs } from "../../siteBasic"

export function Tab({ active }: { active: ActiveTabName }) {
  // タブが増えたら横幅は手動で調整すること
  return (
    <div className="flex flex-row">
      {siteTabs.map((tab) =>
        active === tab.name ? (
          <div key={tab.name} className="mb-8 mt-6 w-1/2 text-center text-sm">
            <Link href={tab.topPage}>
              <div className="max-w-screen mx-auto flex items-center justify-center transition-colors hover:text-[#40404088]">
                <div className="flex w-full flex-col gap-y-1">
                  <div className="w-full font-semibold leading-snug tracking-[0.4px]">
                    {tab.displayText}
                  </div>
                  <div className="mx-auto h-[0.125rem] w-full rounded-full bg-[#1E6FBA]"></div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div
            key={tab.name}
            className="mb-8 mt-6 w-1/2 text-center text-sm transition-colors hover:text-[#40404088]"
          >
            <Link href={tab.topPage}>
              <div className="max-w-screen mx-auto flex items-center justify-center">
                <div className="flex w-full flex-col gap-y-1">
                  <div className="w-full font-light leading-snug tracking-[0.4px]">
                    {tab.displayText}
                  </div>
                  <div className="mx-auto h-[0.125rem] w-full rounded-full bg-[#d9dde3]"></div>
                </div>
              </div>
            </Link>
          </div>
        ),
      )}
    </div>
  )
}
