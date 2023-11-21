import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex w-full flex-col gap-y-4 py-10">
        <Link href="/">
          <Image
            src={"/images/logo.png"}
            width={144}
            height={154}
            alt="pontaのヘッドホンブログ"
            priority
            className="mx-auto block"
          />
        </Link>
      </div>
    </header>
  )
}
