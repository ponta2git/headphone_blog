import Image from "next/image"
import { siteName } from "../../libs/siteBasic"
import Link from "next/link"

export type HeaderProps = {
  isArticle: boolean
}

export default function Header() {
  return (
    <header>
      <Link href="/">
        <div className="flex flex-row content-start items-center justify-start gap-2 px-4 py-6 lg:px-48">
          <Image
            src={"/images/headphone.jpg"}
            width={50}
            height={50}
            alt=""
            className="rounded-full"
          />
          <h1 className="text-lg font-bold leading-tight text-slate-700">
            {siteName}
          </h1>
        </div>
      </Link>
      <div className="relative h-52 max-w-full bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat md:h-72" />
    </header>
  )
}
