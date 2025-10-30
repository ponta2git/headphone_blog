import { AppError as BaseAppError } from "./base";

export { AppError } from "./base";
export {
  FileNotFoundError,
  FileReadError,
  DirectoryScanError,
} from "./file-errors";
export {
  MdxCompileError,
  FrontmatterParseError,
  PostLoadError,
  DateParseError,
  TagNotFoundError,
} from "./post-errors";

/**
 * エラー型判定ヘルパー
 */
export function isAppError(error: unknown): error is BaseAppError {
  return error instanceof BaseAppError;
}

/**
 * エラーコードによる判定
 */
export function hasErrorCode<T extends BaseAppError>(
  error: unknown,
  code: T["code"],
): error is T {
  return isAppError(error) && error.code === code;
}
