"use client";

import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { WithClipboard } from "./ShareWith/WithClipboard";

import { MetaInfo } from "../../../posts/meta";

interface ShareWithProps {
  title: string;
  postdate: string; // yyyyMMdd format
}

export function ShareWith({ title, postdate }: ShareWithProps) {
  return (
    <>
      <div className="font-header-setting flex flex-row items-baseline justify-start gap-x-2 text-sm text-text-meta">
        <p>Share with:</p>
        <p>
          <a
            href={
              "https://twitter.com/intent/tweet" +
              `?text=${title}: ${MetaInfo.siteConfig.name}` +
              `&url=https://ponta-headphone.net/posts/${postdate}`
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
      {/* <div className="font-header-setting mt-2 text-sm text-text-meta">
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
