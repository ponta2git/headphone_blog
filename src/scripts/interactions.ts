const copyButton = document.querySelector<HTMLButtonElement>("[data-copy-url]");
const copyStatus = document.querySelector<HTMLElement>("#copy-status");
const copyUrl = copyButton?.dataset.copyUrl;
if (copyButton && copyStatus && copyUrl) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    copyButton.disabled = true;
    copyStatus.textContent = "コピーしています…";
    try {
      await navigator.clipboard.writeText(copyUrl);
      copyStatus.textContent = "URLをコピーしました。";
    } catch {
      copyStatus.textContent =
        "コピーできませんでした。ブラウザーのアドレス欄からURLをコピーしてください。";
    } finally {
      copyButton.disabled = false;
    }
  });
}

const backToTop =
  document.querySelector<HTMLAnchorElement>("[data-back-to-top]");
if (backToTop) {
  const update = () => {
    // Keep a focused link available until focus moves to the destination.
    backToTop.hidden =
      window.scrollY < 300 && document.activeElement !== backToTop;
  };
  window.addEventListener("scroll", update, { passive: true });
  backToTop.addEventListener("blur", update);
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector<HTMLElement>("#top")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    update();
  });
  update();
}
