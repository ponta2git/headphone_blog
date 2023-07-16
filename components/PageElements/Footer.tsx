import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

export default function Footer() {
  const jpDateString = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  })
  const year = new Date(jpDateString).getFullYear()

  return (
    <footer className="w-screen bg-slate-50 py-8">
      <div className="flex flex-col gap-y-1 text-center text-sm tracking-[0.4px] text-neutral-700">
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
        </div>
        <p>このサイトはGoogle Analyticsを使用しています</p>
        <p>(C){year} ponta.</p>
      </div>
    </footer>
  )
}
