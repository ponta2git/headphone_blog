"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

function pushMetric(m: Metric) {
  const payload = {
    event: "web_vitals",
    metric: m.name,
    id: m.id,
    value: Math.round(m.name === "CLS" ? m.value * 1000 : m.value),
    rating: m.rating,
    delta: m.delta,
    navigationType: (
      performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined
    )?.type,
  };

  if (
    typeof window !== "undefined" &&
    Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer)
  ) {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer!.push(payload);
  } else if (typeof console !== "undefined") {
    console.log("[web-vitals]", payload);
  }
}

export function WebVitalsReporter() {
  useEffect(() => {
    // Register once on mount
    onCLS(pushMetric);
    onINP(pushMetric);
    onLCP(pushMetric);
  }, []);

  return null;
}
