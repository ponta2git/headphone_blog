import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full">
      <p className="mx-auto w-[230px]">
        <Link href="/">
          <Image
            src={"/images/logo.webp"}
            width={230}
            height={230}
            alt="pontaのヘッドホンブログ"
            priority
            className="duration-100 hover:opacity-80 hover:transition-opacity"
          />
        </Link>
      </p>
    </header>
  );
}
