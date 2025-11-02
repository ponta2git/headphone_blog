"use client";

import { useState, useCallback } from "react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faClipboard } from "@fortawesome/free-solid-svg-icons/faClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ShareWith.module.css";

export function ShareWith({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }, [url]);

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className={styles.share}>
      <span>Share:</span>
      <span className={styles.icons}>
        <a
          href={xHref}
          rel="noopener noreferrer"
          target="_blank"
          aria-label="X に共有"
          className={styles.button}
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          aria-label="URL をコピー"
          className={styles.button}
        >
          <FontAwesomeIcon icon={faClipboard} />
        </button>
      </span>
      {copied && <span className={styles.copied}>コピーしました</span>}
    </div>
  );
}
