import Image from "next/image"
import { siteName } from "../../libs/siteBasic"

export type HeaderProps = {
  isArticle: boolean
}

export default function Header() {
  return (
    <header className="mx-6 my-12">
      <div className="mx-auto h-[250px] w-[250px]">
        <Image
          src="/images/key.jpg"
          alt=""
          width={250}
          height={250}
          className="z-0 mx-auto blur-sm"
        />
        <p className="relative z-10 -mt-[170px] bg-white/20 py-8 text-center font-bold text-slate-100 shadow-slate-800 drop-shadow-md backdrop-blur">
          {siteName}
        </p>
      </div>
    </header>
  )
}
