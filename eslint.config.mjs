// @ts-check
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import typescript from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
// @ts-expect-error - eslint-config-next types are not fully compatible with flat config
import nextVitals from "eslint-config-next/core-web-vitals";
// @ts-expect-error - eslint-config-next types are not fully compatible with flat config
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Recommended base configurations
  {
    name: "eslint/recommended",
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
  },
  {
    name: "typescript-eslint/recommended-type-checked",
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...typescript.configs.recommendedTypeChecked],
  },

  // Next.js configurations
  {
    name: "next/core-web-vitals",
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [...nextVitals],
  },
  {
    name: "next/typescript",
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...nextTs],
  },

  // Prettier configuration (must be last to override formatting rules)
  {
    name: "prettier",
    ...prettierConfig,
  }, // Global ignores
  globalIgnores([
    // Next.js default ignores
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional project-specific ignores
    "node_modules/**",
    "public/**",
    "metagen/dist/**",
    "metagen/node_modules/**",
    // Legacy code excluded from linting
    "src/old/**",
  ]),

  // TypeScript parser configuration
  {
    name: "project/typescript-parser",
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Project-specific TypeScript rules
  {
    name: "project/typescript-rules",
    files: [
      "app/**/*.{ts,tsx}",
      "src/**/*.{ts,tsx}",
      "metagen/vite.config.mts",
      "metagen/src/**/*.ts",
    ],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  // Test files with relaxed rules
  {
    name: "project/test-files",
    files: ["specs/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },

  // Config file itself
  {
    name: "project/config-files",
    files: ["eslint.config.mjs"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
]);
