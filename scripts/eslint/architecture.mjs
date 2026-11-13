import path from "node:path";

// Dependencies point toward decisions that change less often. Routes compose them.
const dependencies = {
  config: ["config"],
  domain: ["domain"],
  application: ["application", "domain", "config"],
  infrastructure: ["infrastructure", "application", "domain", "config"],
  presentation: ["presentation", "application", "domain", "config"],
  pages: ["presentation", "application", "domain", "config", "infrastructure"],
  "content.config.ts": ["infrastructure"],
};

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      boundary: "{{from}} must not depend on {{to}}. See docs/architecture.md.",
      environment:
        "Read build environment only in infrastructure/deployment.ts.",
      dynamicImport:
        "Use a literal module path so architecture dependencies can be checked.",
    },
  },
  create(context) {
    const root = path.resolve(context.cwd, "src");
    const filename = context.physicalFilename;
    const from = path.relative(root, filename).split(path.sep).join("/");
    const layer = from.split("/")[0];
    if (!Object.hasOwn(dependencies, layer)) return {};
    const client = from.startsWith("presentation/client/");
    const pure = ["config", "domain", "application"].includes(layer);

    function check(source, dynamic = false) {
      if (!source) return;
      const specifier =
        source.type === "TemplateLiteral" && source.expressions.length === 0
          ? source.quasis[0].value.cooked
          : source.value;
      if (typeof specifier !== "string") {
        if (dynamic)
          context.report({ node: source, messageId: "dynamicImport" });
        return;
      }
      if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
        if (pure || client)
          context.report({
            node: source,
            messageId: "boundary",
            data: { from, to: specifier },
          });
        return;
      }
      // Vite resolves /src/... imports from the project root, not as packages.
      const target = specifier.startsWith("/")
        ? path.resolve(context.cwd, `.${specifier}`)
        : path.resolve(path.dirname(filename), specifier);
      const to = path.relative(root, target).split(path.sep).join("/");
      const targetLayer = to.split("/")[0];
      const composesDeployment =
        from === "presentation/layouts/Page.astro" &&
        /^infrastructure\/deployment(?:\.ts)?$/.test(to);
      const allowed = client
        ? to.startsWith("presentation/client/")
        : dependencies[layer].includes(targetLayer) || composesDeployment;
      if (!allowed)
        context.report({
          node: source,
          messageId: "boundary",
          data: { from, to },
        });
    }

    function environmentOwner(node) {
      return (
        (node?.type === "Identifier" && node.name === "process") ||
        (node?.type === "MetaProperty" && node.meta.name === "import")
      );
    }

    function checkDestructuring(pattern, source) {
      if (
        from === "infrastructure/deployment.ts" ||
        pattern?.type !== "ObjectPattern" ||
        !environmentOwner(source)
      )
        return;
      for (const property of pattern.properties) {
        if (property.type !== "Property") continue;
        const name = property.computed
          ? property.key.value
          : (property.key.name ?? property.key.value);
        if (name === "env")
          context.report({ node: property, messageId: "environment" });
      }
    }

    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ExportAllDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source, true),
      // Type-only imports must obey the same boundary as executable imports.
      TSImportType: (node) => check(node.source ?? node.parameter),
      VariableDeclarator: (node) => checkDestructuring(node.id, node.init),
      AssignmentExpression: (node) => checkDestructuring(node.left, node.right),
      AssignmentPattern: (node) => checkDestructuring(node.left, node.right),
      MemberExpression(node) {
        const property = node.computed
          ? node.property.value
          : node.property.name;
        const environment = property === "env" && environmentOwner(node.object);
        if (environment && from !== "infrastructure/deployment.ts")
          context.report({ node, messageId: "environment" });
      },
    };
  },
};
