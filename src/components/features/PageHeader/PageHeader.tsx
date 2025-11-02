import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  icon?: IconDefinition;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
        <span>{title}</span>
      </h1>
      {description && <div className={styles.description}>{description}</div>}
    </header>
  );
}
