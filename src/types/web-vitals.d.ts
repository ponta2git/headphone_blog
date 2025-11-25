declare module "web-vitals" {
  export type WebVitalRating = "good" | "needs-improvement" | "poor";
  export interface Metric {
    name: string; // 'CLS' | 'LCP' | 'INP' etc
    id: string;
    value: number;
    delta: number;
    rating?: WebVitalRating;
  }
  export function onCLS(cb: (m: Metric) => void): void;
  export function onINP(cb: (m: Metric) => void): void;
  export function onLCP(cb: (m: Metric) => void): void;
}
