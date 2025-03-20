import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";

import { WithClipboard } from "./ShareWith/WithClipboard";
import { MetaInfo } from "../../../MetaInfo";

import type { Post } from "../../../services/post/PostTypes";

export function ShareWith(frontmatter: Post["frontmatter"]) {
  return (
    <>
      <div className="font-header-setting flex flex-row items-baseline justify-start gap-x-2 text-sm text-[#7b8ca2]">
        <p>Share with:</p>
        <p>
          <a
            href={
              "https://twitter.com/intent/tweet" +
              `?text=${frontmatter.title}: ${MetaInfo.siteInfo.name}` +
              `&url=https://ponta-headphone.net/posts/${frontmatter.date.toFormat("yyyyMMdd")}`
            }
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </p>
        <p>or</p>
        <p>
          <WithClipboard />
        </p>
      </div>
      {/* <div className="font-header-setting mt-2 text-sm text-[#7b8ca2]">
        <p>
          投げ銭は
          <a
            href={"https://www.buymeacoffee.com/ponta"}
            rel="noopener noreferrer"
          >
            こちら{" "}
            <Image
              src="/images/bmc-logo-no-background.png"
              alt=""
              width="12"
              height="17"
              className="inline"
            />{" "}
            (Buy me a coffee)
          </a>
        </p>
      </div> */}
    </>
  );
}
