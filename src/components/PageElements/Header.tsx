import Image from "next/image"
import { siteName } from "../../libs/siteBasic"
import Link from "next/link"

export type HeaderProps = {
  isArticle: boolean
}

export default function Header() {
  return (
    <header>
      
        <div className="flex flex-col gap-y-4 w-full mx-auto py-10">
        <Link href="/">
          <Image
            src={"/images/headphone.jpg"}
            width={100}
            height={100}
            alt=""
            className="rounded-full block mx-auto"
          />
          </Link>
          <h1 className="font-bold leading-tight tracking-wide text-slate-700 text-center">
          <Link href="/">{siteName}</Link>
          </h1>
        </div>
    </header>
  )
}
