import Image from "next/image"
import { siteName } from "../../utils/siteBasic"
import Link from "next/link"

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex w-full flex-col gap-y-4 py-10">
        <Link href="/">
          <Image
            src={"/images/headphone.jpg"}
            width={100}
            height={100}
            alt=""
            className="mx-auto block rounded-full drop-shadow-xl"
          />
        </Link>
        <h1 className="text-center font-bold leading-tight tracking-wide text-slate-700">
          <Link href="/">{siteName}</Link>
        </h1>
      </div>
    </header>
  )
}
