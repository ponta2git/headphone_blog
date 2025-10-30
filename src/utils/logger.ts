/**
 * ログレベル定義
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * 構造化ログ出力クラス
 *
 * 各モジュールで使用し、コンテキスト付きログを出力する
 */
export class Logger {
  constructor(
    private readonly context: string,
    private readonly level: LogLevel = LogLevel.INFO,
  ) {}

  /**
   * DEBUGレベルログ（詳細なトレース情報）
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.DEBUG) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      console.debug(`[${this.context}] ${message}${metaStr}`);
    }
  }

  /**
   * INFOレベルログ（通常の処理フロー）
   */
  info(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.INFO) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      console.log(`[${this.context}] ${message}${metaStr}`);
    }
  }

  /**
   * WARNレベルログ（警告）
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.WARN) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      console.warn(`[${this.context}] ${message}${metaStr}`);
    }
  }

  /**
   * ERRORレベルログ（エラー）
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    if (this.level <= LogLevel.ERROR) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      console.error(`[${this.context}] ${message}${metaStr}`, error || "");
    }
  }
}

/**
 * Loggerファクトリー関数
 *
 * 環境変数 LOG_LEVEL でログレベルを制御
 * - DEBUG: すべてのログを出力
 * - INFO: INFO以上を出力（デフォルト）
 * - WARN: WARN以上を出力
 * - ERROR: ERRORのみ出力
 */
export function createLogger(context: string): Logger {
  const logLevelStr = process.env.LOG_LEVEL || "INFO";

  const level =
    {
      DEBUG: LogLevel.DEBUG,
      INFO: LogLevel.INFO,
      WARN: LogLevel.WARN,
      ERROR: LogLevel.ERROR,
    }[logLevelStr.toUpperCase()] || LogLevel.INFO;

  return new Logger(context, level);
}
