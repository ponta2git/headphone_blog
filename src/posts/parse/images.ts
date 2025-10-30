import fs from "node:fs/promises";
import path from "node:path";
import { createLogger } from "../../utils/logger";

const logger = createLogger("posts/parse/images");

/**
 * 画像サイズ情報
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 画像ファイルからサイズを検出
 *
 * WebP/JPEG/PNG のヘッダーをパースしてサイズを取得
 * ファイル全体を読み込まず、最初の4KBのみ読み込む
 *
 * @param imagePath - 画像パス（/images/...形式）
 * @returns サイズ情報（検出失敗時はnull）
 */
export async function detectImageSize(
  imagePath: string,
): Promise<ImageSize | null> {
  logger.debug(`Detecting image size: ${imagePath}`);

  try {
    const absolutePath = path.join(process.cwd(), "public", imagePath);
    const fd = await fs.open(absolutePath, "r");
    const buffer = Buffer.alloc(4096); // ヘッダー部分のみ読み込み
    await fd.read(buffer, 0, 4096, 0);
    await fd.close();

    // WebP/JPEG/PNG のヘッダーをパース
    const size =
      parseWebPSize(buffer) || parseJPEGSize(buffer) || parsePNGSize(buffer);

    if (size) {
      logger.debug(`Detected image size: ${imagePath}`, {
        width: size.width,
        height: size.height,
      });
    } else {
      logger.warn(`Failed to detect image size: ${imagePath}`);
    }

    return size;
  } catch (error) {
    logger.error(`Failed to read image file: ${imagePath}`, error as Error);
    return null;
  }
}

/**
 * WebP画像のサイズを取得
 */
function parseWebPSize(buffer: Buffer): ImageSize | null {
  // WebP RIFF header
  if (buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buffer.toString("ascii", 8, 12) !== "WEBP") return null;

  // VP8/VP8L/VP8X chunk
  const chunkHeader = buffer.toString("ascii", 12, 16);

  if (chunkHeader === "VP8 ") {
    // VP8 (lossy)
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { width, height };
  } else if (chunkHeader === "VP8L") {
    // VP8L (lossless)
    const bits = buffer.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  } else if (chunkHeader === "VP8X") {
    // VP8X (extended)
    const width = buffer.readUIntLE(24, 3) + 1;
    const height = buffer.readUIntLE(27, 3) + 1;
    return { width, height };
  }

  return null;
}

/**
 * JPEG画像のサイズを取得
 */
function parseJPEGSize(buffer: Buffer): ImageSize | null {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;

    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      // Start of Frame
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }

    offset += 2 + buffer.readUInt16BE(offset + 2);
  }

  return null;
}

/**
 * PNG画像のサイズを取得
 */
function parsePNGSize(buffer: Buffer): ImageSize | null {
  if (buffer.toString("ascii", 1, 4) !== "PNG") return null;

  // IHDR chunk (offset 16)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}
