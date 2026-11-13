import path from "node:path";
import { Linter } from "eslint";
import ts from "typescript-eslint";
import { describe, expect, it } from "vitest";
import architecture from "../../scripts/eslint/architecture.mjs";

const linter = new Linter();
function violations(file: string, code: string) {
  return linter.verify(
    code,
    [
      {
        files: ["**/*.ts", "**/*.astro"],
        languageOptions: { parser: ts.parser },
        plugins: { project: { rules: { architecture } } },
        rules: { "project/architecture": "error" },
      },
    ],
    { filename: path.resolve("src", file) },
  );
}

describe("architecture dependency boundaries", () => {
  it.each([
    ["application/catalog.ts", 'import type { Post } from "../domain/posts";'],
    [
      "infrastructure/content/posts.ts",
      'import { createPostCatalog } from "../../application/catalog";',
    ],
    [
      "presentation/views/PostArticle.astro",
      'import { buildArticleMetadata } from "../../application/metadata";',
    ],
    [
      "presentation/layouts/Page.astro",
      'import { deployment } from "../../infrastructure/deployment";',
    ],
    [
      "pages/index.astro",
      'import { getPostCatalog } from "../infrastructure/content/posts";',
    ],
    ["presentation/client/interactions.ts", 'import "./copy-url";'],
    [
      "application/catalog.ts",
      'import type { Post } from "/src/domain/posts";',
    ],
    ["application/catalog.ts", "const domain = import(`../domain/posts`);"],
    ["infrastructure/deployment.ts", "const env = import.meta.env;"],
    ["infrastructure/deployment.ts", "const { env } = import.meta;"],
  ])("allows the documented dependency from %s", (file, code) => {
    expect(violations(file, code)).toEqual([]);
  });

  it.each([
    [
      "domain/posts.ts",
      'import { getPostCatalog } from "../infrastructure/content/posts";',
    ],
    ["domain/posts.ts", 'import { site } from "../config/site";'],
    [
      "application/catalog.ts",
      'export * from "../infrastructure/content/posts";',
    ],
    [
      "application/catalog.ts",
      'export { getPostCatalog } from "../infrastructure/content/posts";',
    ],
    [
      "application/catalog.ts",
      'const adapter = import("../infrastructure/content/posts");',
    ],
    [
      "application/catalog.ts",
      'type Adapter = import("../infrastructure/content/posts");',
    ],
    ["application/catalog.ts", 'import { render } from "astro:content";'],
    ["config/site.ts", 'import fs from "node:fs";'],
    [
      "presentation/views/PostArticle.astro",
      'import { getPostCatalog } from "../../infrastructure/content/posts";',
    ],
    [
      "presentation/views/PostArticle.astro",
      'import { getPostCatalog } from "/src/infrastructure/content/posts";',
    ],
    [
      "application/catalog.ts",
      "const adapter = import(`../infrastructure/content/posts`);",
    ],
    [
      "presentation/views/PostArticle.astro",
      "const adapter = import(`/src/infrastructure/content/posts`);",
    ],
    [
      "presentation/client/interactions.ts",
      'import { site } from "../../config/site";',
    ],
    [
      "presentation/client/interactions.ts",
      'import { render } from "astro:content";',
    ],
    [
      "infrastructure/content/posts.ts",
      'import View from "../../presentation/views/PostArticle.astro";',
    ],
    ["domain/posts.ts", 'import "../../scripts/verify-deployment.mjs";'],
  ])("rejects a reverse or runtime dependency from %s", (file, code) => {
    expect(violations(file, code).map((message) => message.messageId)).toEqual([
      "boundary",
    ]);
  });

  it.each([
    "import.meta.env.PROD",
    "process.env.SITE_ENV",
    'process["env"].SITE_ENV',
  ])("keeps environment access out of policy: %s", (expression) => {
    expect(
      violations("config/deployment.ts", `const env = ${expression};`).map(
        (message) => message.messageId,
      ),
    ).toEqual(["environment"]);
  });

  it.each([
    'const name = "../infrastructure/content/posts"; const adapter = import(name);',
    'const name = "posts"; const adapter = import(`../infrastructure/content/${name}`);',
    'const adapter = import("../infrastructure/" + "content/posts");',
  ])(
    "rejects imports whose dependency cannot be checked statically: %s",
    (code) => {
      expect(
        violations("application/catalog.ts", code).map(
          (message) => message.messageId,
        ),
      ).toEqual(["dynamicImport"]);
    },
  );

  it.each([
    "const { env } = import.meta;",
    "const { env: buildEnvironment } = process;",
    'const { ["env"]: buildEnvironment } = import.meta;',
    'const { "env": buildEnvironment } = process;',
    "let env; ({ env } = import.meta);",
    "function read({ env } = process) {}",
  ])(
    "keeps destructured environment access at the build boundary: %s",
    (code) => {
      expect(
        violations("infrastructure/content/posts.ts", code).map(
          (message) => message.messageId,
        ),
      ).toEqual(["environment"]);
    },
  );
});
