import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import globals from "globals";
import ts from "typescript-eslint";
import architecture from "./scripts/eslint/architecture.mjs";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      ".next/**",
      "out/**",
      ".playwright-mcp/**",
      ".vercel/**",
      ".pnpm-store/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  prettier,
  {
    languageOptions: { globals: globals.node },
    rules: { "@typescript-eslint/consistent-type-imports": "error" },
  },
  {
    files: ["src/presentation/client/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["src/**/*.{ts,astro}"],
    plugins: { project: { rules: { architecture } } },
    rules: { "project/architecture": "error" },
  },
  {
    files: ["src/{domain,application,config}/**/*.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        "process",
        "window",
        "document",
        "navigator",
      ],
    },
  },
];
