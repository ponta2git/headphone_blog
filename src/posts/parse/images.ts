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

    try {
      const buffer = Buffer.alloc(4096); // ヘッダー部分のみ読み込み
      await fd.read(buffer, 0, 4096, 0);

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
    } finally {
      try {
        await fd.close();
      } catch {}
    }
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
  const chunkStart = 12;
  if (buffer.length < chunkStart + 8) return null;

  const chunkHeader = buffer.toString("ascii", chunkStart, chunkStart + 4);
  const chunkSize = buffer.readUInt32LE(chunkStart + 4);
  const payloadBase = chunkStart + 8;

  if (chunkHeader === "VP8 ") {
    // VP8 (lossy)
    // RFC 6386: keyframe payload contains start code 0x9D 0x01 0x2A,
    // followed by 16-bit little-endian width/height with scale bits in the top 2 bits.
    // Typical layout: 3-byte frame tag, then 3-byte start code.
    const payloadAvailable = Math.min(
      chunkSize,
      Math.max(0, buffer.length - payloadBase),
    );
    if (payloadAvailable < 10) return null;

    const scanLimit = Math.min(payloadAvailable, 64);
    let signaturePos = -1;

    // Fast path: start code at payloadBase + 3
    const fastPos = payloadBase + 3;
    if (
      fastPos + 6 < buffer.length &&
      buffer[fastPos] === 0x9d &&
      buffer[fastPos + 1] === 0x01 &&
      buffer[fastPos + 2] === 0x2a
    ) {
      signaturePos = fastPos;
    } else {
      // Fallback: scan the beginning of the payload for the signature
      for (let i = payloadBase; i <= payloadBase + scanLimit - 3; i++) {
        if (
          buffer[i] === 0x9d &&
          buffer[i + 1] === 0x01 &&
          buffer[i + 2] === 0x2a
        ) {
          signaturePos = i;
          break;
        }
      }
    }

    if (signaturePos < 0) return null;
    if (signaturePos + 7 >= buffer.length) return null;

    const width = buffer.readUInt16LE(signaturePos + 3) & 0x3fff;
    const height = buffer.readUInt16LE(signaturePos + 5) & 0x3fff;
    return { width, height };
  } else if (chunkHeader === "VP8L") {
    // VP8L (lossless)
    if (payloadBase + 5 > buffer.length) return null;
    const bits = buffer.readUInt32LE(payloadBase + 1);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  } else if (chunkHeader === "VP8X") {
    // VP8X (extended)
    if (payloadBase + 10 > buffer.length) return null;
    const width = buffer.readUIntLE(payloadBase + 4, 3) + 1;
    const height = buffer.readUIntLE(payloadBase + 7, 3) + 1;
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
    // Ensure we can read marker (2 bytes)
    if (offset + 1 >= buffer.length) break;

    if (buffer[offset] !== 0xff) break;

    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      // Start of Frame
      // Ensure we can read height and width (offset + 7 + 2 bytes)
      if (offset + 9 > buffer.length) break;

      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }

    // Ensure we can read segment length
    if (offset + 4 > buffer.length) break;

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
