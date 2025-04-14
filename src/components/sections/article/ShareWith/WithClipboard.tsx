"use client";

import { faClipboard } from "@fortawesome/free-solid-svg-icons/faClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback, type KeyboardEventHandler } from "react";

export function WithClipboard() {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, []);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLSpanElement>>(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <>
      <span
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
