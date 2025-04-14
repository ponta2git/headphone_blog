"use client";

import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled past a percentage of viewport height
  const toggleVisibility = () => {
    // Show button after scrolling 30% of the viewport height
    const scrollThreshold = window.innerHeight * 0.3;

    if (window.scrollY > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll position to top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Calculate threshold on initial load and window resize
    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", toggleVisibility);

    // Initial check in case page loads already scrolled
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-8 bottom-8 transform rounded-full bg-link-azure p-3 text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-link-azure/80 focus:outline-none ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5" />
    </button>
  );
}
