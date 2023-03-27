declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_GA_TRACKING_ID?: string;
      }
    }
  }
}

export type Frontmatter = {
  title: string;
  date: string;
};
