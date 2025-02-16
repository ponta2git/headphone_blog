/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function WithClipboard() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <>
      <span onClick={handleClick} className="cursor-pointer">
        <FontAwesomeIcon icon={faClipboard} />
      </span>
      &nbsp;
      {copied && <span className="text-xs">コピーしました！</span>}
    </>
  );
}
