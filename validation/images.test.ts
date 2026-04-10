import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, afterAll } from "vitest";
import { detectImageSize } from "../src/posts/parse/images";

function buildVP8LossyWebP({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  // VP8 keyframe header: 3-byte frame tag + 0x9D012A + width/height (LE, 14-bit values)
  const frameTag = Buffer.from([0x10, 0x00, 0x00]);
  const startCode = Buffer.from([0x9d, 0x01, 0x2a]);

  const w = Buffer.alloc(2);
  const h = Buffer.alloc(2);
  w.writeUInt16LE(width & 0x3fff, 0);
  h.writeUInt16LE(height & 0x3fff, 0);

  const payload = Buffer.concat([frameTag, startCode, w, h]); // 10 bytes (even)

  const chunkHeader = Buffer.from("VP8 ", "ascii");
  const chunkSize = Buffer.alloc(4);
  chunkSize.writeUInt32LE(payload.length, 0);
  const chunk = Buffer.concat([chunkHeader, chunkSize, payload]);

  const riffSize = Buffer.alloc(4);
  // RIFF size is file size minus 8 bytes ("RIFF" + size field)
  riffSize.writeUInt32LE(4 + chunk.length, 0); // "WEBP" + chunks

  return Buffer.concat([
    Buffer.from("RIFF", "ascii"),
    riffSize,
    Buffer.from("WEBP", "ascii"),
    chunk,
  ]);
}

describe("Image size parsing", () => {
  const relDir = path.join("public", "images", "__test__");
  const filePath = path.join(process.cwd(), relDir, "vp8-lossy.webp");

  afterAll(async () => {
    try {
      await fs.rm(path.join(process.cwd(), relDir), {
        recursive: true,
        force: true,
      });
    } catch {}
  });

  it("detects VP8 (lossy) WebP size via keyframe header", async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const expected = { width: 300, height: 200 };
    const webp = buildVP8LossyWebP(expected);
    await fs.writeFile(filePath, webp);

    const size = await detectImageSize("/images/__test__/vp8-lossy.webp");
    expect(size).toEqual(expected);
  });
});
