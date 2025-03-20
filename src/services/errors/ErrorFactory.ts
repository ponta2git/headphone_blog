export function createFileLoadError(filePath: string, error: unknown) {
  return new Error(`File load error at "${filePath}": ${String(error)}`);
}

export function FileListCreateError(cause: unknown) {
  return new Error("Cannot create file list.", { cause });
}

export function createMdxCompileError(error: unknown) {
  return new Error(`MDX compile error: ${String(error)}`);
}

export function createParseFrontmatterError(message: string) {
  return new Error(`Frontmatter parse error: ${message}`);
}

export function createPostComposeError(message: string, error: unknown) {
  return new Error(`${message}: ${String(error)}`);
}
