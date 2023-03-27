export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

export const pageView = (path: string) => {
  if (typeof window !== undefined) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: path,
    });
  }
};
