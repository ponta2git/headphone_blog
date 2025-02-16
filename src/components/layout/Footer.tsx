import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import Link from "next/link";

export default function Footer() {
  const year = DateTime.now().year;

  return (
    <footer className="bg-[#CCE0FF] py-8">
      <div className="flex flex-col gap-y-2 text-center text-sm tracking-[0.4px] text-[#555555]">
        <div className="mb-2 flex flex-row justify-center gap-x-6">
          <a href="mailto:coshun@gmail.com" className="h-4 w-4">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a
            href="https://twitter.com/ponta2twit"
            rel="noopener noreferrer"
            className="h-4 w-4"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="/rss.xml" className="h-4 w-4">
            <FontAwesomeIcon icon={faRss} />
          </a>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <p className="text-xs">(C){year} ponta.</p>
        <p className="text-xs">
          under{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            rel="noopener noreferrer"
          >
            CC BY-NC-ND 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
