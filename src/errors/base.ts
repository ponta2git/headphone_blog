/**
 * アプリケーション全体の基底エラークラス
 *
 * 静的生成のため、エラーは原因箇所特定を重視し、
 * リトライ機構は持たない
 */
export abstract class AppError extends Error {
  /**
   * エラーコード（型判別とログ分類に使用）
   */
  abstract readonly code: string;

  /**
   * エラーコンテキスト（デバッグ情報）
   */
  readonly context?: Record<string, unknown>;

  /**
   * 元のエラー（エラーチェーン用）
   */
  override readonly cause?: Error;

  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.cause = cause;

    // スタックトレースの保持（V8環境）
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * デバッグ用の詳細情報を取得
   */
  getDetails(): string {
    const details = [`[${this.code}] ${this.name}: ${this.message}`];

    if (this.context && Object.keys(this.context).length > 0) {
      details.push(`Context: ${JSON.stringify(this.context, null, 2)}`);
    }

    if (this.cause) {
      details.push(`Caused by: ${this.cause.message}`);
    }

    return details.join("\n");
  }
}
