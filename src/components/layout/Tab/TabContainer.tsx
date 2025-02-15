import { Tab } from "./Tab";
import Container from "../Container";

import type { PageTabName } from "../../../domain/PageTab";
import type { ReactNode } from "react";

export default function TabContainer({
  children,
  activeTab,
}: {
  children: ReactNode;
  activeTab: PageTabName;
}) {
  return (
    <div className="relative">
      <Tab active={activeTab} />
      <Container>{children}</Container>
    </div>
  );
}
