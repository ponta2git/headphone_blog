"use client";

import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback } from "react";

export function WithClipboard() {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, []);

  return (
    <>
      <span
        onClick={handleClick}
        className="cursor-pointer"
        tabIndex={0}
        role="button"
      >
        <FontAwesomeIcon icon={faClipboard} />
      </span>
      &nbsp;
      {copied && <span className="text-xs">コピーしました！</span>}
    </>
  );
}
