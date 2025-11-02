import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faRss } from "@fortawesome/free-solid-svg-icons/faRss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import NextLink from "next/link";
import { Link } from "../../ui/Link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = DateTime.now().year;

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a
          href="mailto:coshun@gmail.com"
          className={styles.iconLink}
          aria-label="Email"
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <a
          href="https://twitter.com/ponta2twit"
          className={styles.iconLink}
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="/rss.xml" className={styles.iconLink} aria-label="RSS">
          <FontAwesomeIcon icon={faRss} />
        </a>
        <NextLink href="/privacy" className={styles.textLink}>
          Privacy Policy
        </NextLink>
      </div>
      <p className={styles.copyright}>&copy; {year} ponta.</p>
      <p className={styles.license}>
        under{" "}
        <Link
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
          external
          variant="muted"
        >
          CC BY-NC-ND 4.0
        </Link>
      </p>
    </footer>
  );
}
