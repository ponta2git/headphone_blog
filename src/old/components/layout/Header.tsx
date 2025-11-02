import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div id="header-container">
        <Link href="/">
          <Image
            src={"/images/logo.webp"}
            alt="pontaのヘッドホンブログ"
            fill
            loading="lazy"
            className="object-contain center"
          />
        </Link>
      </div>
    </header>
  );
}
