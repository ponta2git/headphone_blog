import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="w-full">
        <Link href="/">
          <Image
            src={"/images/headphone_blog_logo.png"}
            width={230}
            height={230}
            alt="pontaのヘッドホンブログ"
            priority
            className="mx-auto block"
          />
        </Link>
      </div>
    </header>
  );
}
