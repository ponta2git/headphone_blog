import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-container"
      className="center margin-start-section margin-end-section bg-content border-rounded-xsmall"
    >
      <div id="inner-main-container" className="text-body">
        {children}
      </div>
    </main>
  );
}
