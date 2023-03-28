declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_GTAGMGR_ID?: string;
      }
    }
  }
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type Frontmatter = {
  title: string;
  date: string;
};
