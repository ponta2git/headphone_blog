import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import globals from "globals";
import ts from "typescript-eslint";

export default [
  { ignores: ["dist/**", ".astro/**", "node_modules/**"] },
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
    files: ["src/scripts/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["src/lib/blog.ts", "src/lib/markdown.ts", "src/scripts/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["astro", "astro:*", "astro/*", "@astrojs/*"],
              message:
                "Keep blog rules and browser behavior independent of Astro.",
            },
          ],
        },
      ],
    },
  },
];
