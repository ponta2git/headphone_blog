import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full">
      <Link href="/">
        <Image
          src={"/images/logo.webp"}
          width={230}
          height={230}
          alt="pontaのヘッドホンブログ"
          priority
          className="mx-auto block"
        />
      </Link>
    </header>
  );
}
