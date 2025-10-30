/**
 * デバッグモードフラグ
 *
 * 環境変数 DEBUG=true で有効化
 */
export const DEBUG = process.env.DEBUG === "true";

/**
 * デバッグログ出力
 *
 * DEBUG=true の場合のみログを出力
 *
 * @param context - ログのコンテキスト（モジュール名など）
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function debugLog(
  context: string,
  message: string,
  data?: unknown,
): void {
  if (DEBUG) {
    const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : "";
    console.log(`[DEBUG:${context}] ${message}${dataStr}`);
  }
}
