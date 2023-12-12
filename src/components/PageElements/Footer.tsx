import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateTime } from "luxon"

export default function Footer() {
  const year = DateTime.now().year

  return (
    <footer className="w-screen bg-slate-50 py-6">
      <div className="flex flex-col gap-y-1 text-center text-sm tracking-[0.4px] text-[#7b8ca2]">
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
        <p className="text-xs">このサイトはGoogle Analyticsを使用しています</p>
        <p className="text-xs">(C){year} ponta.</p>
      </div>
    </footer>
  )
}
