import Image from "next/image";
import NextLink from "next/link";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <NextLink href="/">
          <Image
            src="/images/logo.webp"
            alt="pontaのヘッドホンブログ"
            fill
            className={styles.logo}
            priority
            sizes="(max-width: 640px) 100vw, 900px"
          />
        </NextLink>
      </div>
    </header>
  );
}
