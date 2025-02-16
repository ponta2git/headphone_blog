import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons/faCommentDots";
import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons/faHeadphonesSimple";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavMenu() {
  return (
    <nav className="font-header-setting rounded-lg bg-[#E1FFEE] p-3 shadow-md">
      <ul className="flex items-center justify-evenly space-x-2">
        <li className="text-center">
          <Link href="/">
            <span
              className={`rounded-md px-2 py-2 align-middle text-sm font-medium text-[#121a2488] hover:bg-[#C8E6C9]`}
            >
              <FontAwesomeIcon icon={faBolt} className="inline-block h-4 w-4" />{" "}
              新着
            </span>
          </Link>
        </li>
        <li className="text-center">
          <Link href="/impressions">
            <span
              className={`rounded-md px-2 py-2 align-middle text-sm font-medium text-[#121a2488] hover:bg-[#C8E6C9]`}
            >
              <FontAwesomeIcon
                icon={faHeadphonesSimple}
                className="inline-block h-4 w-4"
              />{" "}
              &nbsp;感想
            </span>
          </Link>
        </li>
        <li className="text-center">
          <Link href="/discussions">
            <span
              className={`rounded-md px-2 py-2 align-middle text-sm font-medium text-[#121a2488] hover:bg-[#C8E6C9]`}
            >
              <FontAwesomeIcon
                icon={faCommentDots}
                className="inline-block h-4 w-4"
              />{" "}
              &nbsp;考察
            </span>
          </Link>
        </li>
        <li className="text-center">
          <Link href="/tags">
            <span
              className={`rounded-md px-2 py-2 align-middle text-sm font-medium text-[#121a2488] hover:bg-[#C8E6C9]`}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="inline-block h-4 w-4"
              />{" "}
              さがす
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
