import { AppError } from "./base";

/**
 * ファイルが見つからない
 */
export class FileNotFoundError extends AppError {
  readonly code = "FILE_NOT_FOUND" as const;

  constructor(filePath: string, cause?: Error) {
    super(`File not found: ${filePath}`, { filePath }, cause);
  }
}

/**
 * ファイル読み込みエラー
 */
export class FileReadError extends AppError {
  readonly code = "FILE_READ_ERROR" as const;

  constructor(filePath: string, cause?: Error) {
    super(`Failed to read file: ${filePath}`, { filePath }, cause);
  }
}

/**
 * ディレクトリスキャンエラー
 */
export class DirectoryScanError extends AppError {
  readonly code = "DIRECTORY_SCAN_ERROR" as const;

  constructor(directoryPath: string, cause?: Error) {
    super(
      `Failed to scan directory: ${directoryPath}`,
      { directoryPath },
      cause,
    );
  }
}
