export function FileLoadError(path: string, cause: unknown) {
  return new Error(`Cannot load file: ${path}`, { cause })
}

export function FileListCreateError(cause: unknown) {
  return new Error("Cannot create file list.", { cause })
}

export function PostComposeError(fileName: string, cause: unknown) {
  return new Error(`Cannot compose post. post file: ${fileName}`, { cause })
}

export function MDXCompileError(cause: unknown) {
  return new Error("Cannot compile MDX.", { cause })
}

export function ParseFrontmatterError(message: string) {
  return new Error(`Cannot parse raw frontmatter. cause: ${message}`)
}

export function TagTitleError(str: string) {
  return new Error(`${str} is not in tag definitions.`)
}

export function TagPathError(str: string) {
  return new Error(`${str} is not in tag paths.`)
}
