// tailwind.config.js
export default {
  theme: {
    colors: {
      // Base colors
      primary: {
        DEFAULT: "#1E6FBA",
        light: "#4682B4",
        hover: "#1E6FBA88",
      },

      // Background palette
      bg: {
        base: "#F0FFFF", // Main background
        menu: "#E1FFEE", // Nav menu background
        hover: "#C8E6C9", // Hover background
        footer: "#CCE0FF", // Footer background
        alt: "#f0f8ff", // Alternative background
      },

      // Text colors
      text: {
        DEFAULT: "#484848", // Base text
        heading: "#2F4F4F", // Headings
        secondary: "#555555", // Secondary text
        meta: "#7b8ca2", // Metadata text
        nav: "#121a2488", // Nav text with opacity
      },

      // Link colors
      link: {
        blue: {
          DEFAULT: "#4682B4",
          hover: "#4682B488",
        },
        azure: {
          DEFAULT: "#1E6FBA",
          hover: "#1E6FBA88",
        },
      },

      // Utility
      white: "#FFFFFF",
      transparent: "transparent",
      current: "currentColor",
    },
    // Extend existing theme settings
    extend: {
      borderColor: (theme) => ({
        DEFAULT: theme("colors.bg.footer"),
      }),
      boxShadow: {
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
};
