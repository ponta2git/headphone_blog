import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faRss } from "@fortawesome/free-solid-svg-icons/faRss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import Link from "next/link";

export default function Footer() {
  const year = DateTime.now().year;

  return (
    <footer className="bg-footer text-center text-small center border-rounded border-solid-light">
      <div id="informations">
        <a href="mailto:coshun@gmail.com">
          <FontAwesomeIcon icon={faEnvelope} aria-label="Email" />
        </a>
        <a href="https://twitter.com/ponta2twit" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} aria-label="Twitter" />
        </a>
        <a href="/rss.xml">
          <FontAwesomeIcon icon={faRss} aria-label="RSS" />
        </a>
        <Link href="/privacy" className="text-decoration-none">
          Privacy Policy
        </Link>
      </div>
      <p>(C){year} ponta.</p>
      <p>
        under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
          rel="noopener noreferrer"
          className="text-decoration-none"
        >
          CC BY-NC-ND 4.0
        </a>
      </p>
    </footer>
  );
}
