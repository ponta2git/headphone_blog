export function FileLoadError(path: string, cause: unknown) {
  return new Error(`Cannot load file: ${path}`, { cause });
}

export function FileListCreateError(cause: unknown) {
  return new Error("Cannot create file list.", { cause });
}

export function ParseFrontmatterError(message: string) {
  return new Error(`Cannot parse raw frontmatter. cause: ${message}`);
}

export function TagTitleError(str: string) {
  return new Error(`${str} is not in tag definitions.`);
}

export function TagPathError(str: string) {
  return new Error(`${str} is not in tag paths.`);
}

export function InvalidDateStringFormatError(
  str: string,
  expectedFormat: string,
) {
  return new Error(
    `${str} is not valid date format. Expected format is ${expectedFormat}.`,
  );
}
