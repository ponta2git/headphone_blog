import fs from "fs";
import path from "path";

/**
 * MDXコンテンツから最初の画像パスを抽出する
 * @param mdxContent MDXコンテンツの文字列
 * @returns 画像パスまたはundefined
 */
export function extractFirstImagePath(mdxContent: string): string | undefined {
  // Markdown画像構文を検出する正規表現
  // ![alt text](/path/to/image.ext) または ![alt text](https://example.com/image.ext)
  const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/;
  const match = mdxContent.match(imageRegex);

  if (match && match[1]) {
    return match[1];
  }

  return undefined;
}

/**
 * 画像パスが存在するかどうかを確認
 * @param imagePath 画像パス
 * @returns 画像が存在すればtrue
 */
export function imageExists(imagePath: string): boolean {
  // 相対パスを処理（/images/... で始まる場合）
  if (imagePath.startsWith("/")) {
    const absolutePath = path.join(process.cwd(), "public", imagePath);
    return fs.existsSync(absolutePath);
  }

  // 絶対URLの場合は存在すると仮定
  return imagePath.startsWith("http");
}

/**
 * 画像パスを完全なURLに変換
 * @param imagePath 画像パス
 * @param baseUrl ベースとなるサイトURL
 * @returns 完全なURL
 */
export function getFullImageUrl(imagePath: string, baseUrl: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // 先頭のスラッシュを削除
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseUrl}${cleanPath}`;
}

/**
 * 画像の推定サイズを取得
 *
 * 今回は固定値を返す実装だが、将来的には実際の画像サイズを取得する実装に変更可能
 * @returns 画像のサイズ (width, height)
 */
export function getImageDimensions(): { width: number; height: number } {
  return {
    width: 1200,
    height: 630,
  };
}

/**
 * MDXコンテンツから画像メタデータを抽出
 * @param mdxContent MDXコンテンツの文字列
 * @param baseUrl ベースとなるサイトURL
 * @returns 画像URLとその寸法（存在する場合）
 */
export function getImageMetadata(
  mdxContent: string,
  baseUrl: string,
): { url?: string; width?: number; height?: number } {
  const imagePath = extractFirstImagePath(mdxContent);

  if (!imagePath) {
    return {};
  }

  if (!imageExists(imagePath)) {
    return {};
  }

  const fullUrl = getFullImageUrl(imagePath, baseUrl);
  const dimensions = getImageDimensions();

  return {
    url: fullUrl,
    width: dimensions.width,
    height: dimensions.height,
  };
}
